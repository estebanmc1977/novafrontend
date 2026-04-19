# Coupon Discount Fix — Medusa as Source of Truth

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the actual Openpay charge match the discounted total shown in the UI by using Medusa's cart total as the authoritative amount.

**Architecture:** Apply the coupon promotion to the Medusa cart during preload (not on submit), read the resulting `cart.total` from Medusa's response, surface that value in the UI and let it flow into the payment session. Remove the silent error swallow so coupon failures become visible errors.

**Tech Stack:** Next.js 15, React 19, TypeScript, Medusa V2 Store API, React Context + localStorage.

---

## File Map

| File | Change |
|---|---|
| `apps/storefront/contexts/CartContext.tsx` | Persist coupon to localStorage so it survives page refreshes |
| `apps/storefront/app/[locale]/checkout/page.tsx` | Add `medusaCartTotal` state, apply coupon in preload, remove silent swallow, update UI |

No new files. `lib/medusa.ts` is not touched — `cart.applyPromotion()` already returns `MedusaCart` with `discount_total`.

---

## Task 1: Persist coupon to localStorage in CartContext

**Files:**
- Modify: `apps/storefront/contexts/CartContext.tsx`

Today the coupon lives only in React state. A page refresh on `/checkout` drops the coupon from context so `applyPromotion` is never called and the full price is charged.

- [ ] **Step 1: Add the storage key constant and lazy initializer**

In `apps/storefront/contexts/CartContext.tsx`, replace:

```ts
const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
```

with:

```ts
const COUPON_STORAGE_KEY = "novapatch_coupon";

const [coupon, setCoupon] = useState<AppliedCoupon | null>(() => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(COUPON_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AppliedCoupon) : null;
  } catch {
    return null;
  }
});
```

- [ ] **Step 2: Update `applyCoupon` to write to localStorage**

In the `CartContext.Provider` value object, replace:

```ts
applyCoupon: (c) => setCoupon(c),
```

with:

```ts
applyCoupon: (c) => {
  setCoupon(c);
  if (typeof window !== "undefined") {
    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(c));
  }
},
```

- [ ] **Step 3: Update `removeCoupon` to clear localStorage**

Replace:

```ts
removeCoupon: () => setCoupon(null),
```

with:

```ts
removeCoupon: () => {
  setCoupon(null);
  if (typeof window !== "undefined") {
    localStorage.removeItem(COUPON_STORAGE_KEY);
  }
},
```

- [ ] **Step 4: Manual verify — coupon survives refresh**

1. Start dev server: `cd apps/storefront && pnpm run dev`
2. Open the cart drawer, apply coupon `TEST 25`.
3. Navigate to `/checkout`.
4. Hard-refresh the page (`Cmd+Shift+R`).
5. Confirm the coupon discount still shows in the order summary.
6. Open DevTools → Application → Local Storage → check `novapatch_coupon` key exists with `{"code":"TEST 25","discountPct":25,...}`.

- [ ] **Step 5: Commit**

```bash
git add apps/storefront/contexts/CartContext.tsx
git commit -m "feat(cart): persist applied coupon to localStorage"
```

---

## Task 2: Add new state and ref to checkout page

**Files:**
- Modify: `apps/storefront/app/[locale]/checkout/page.tsx`

- [ ] **Step 1: Add `medusaCartTotal` state and `couponAppliedInPreload` ref**

In `apps/storefront/app/[locale]/checkout/page.tsx`, after the existing preload refs (line ~362):

```ts
const preloadStarted = useRef(false);
const itemsPreloaded = useRef(false);
```

Add immediately after:

```ts
const couponAppliedInPreload = useRef(false);
const [medusaCartTotal, setMedusaCartTotal] = useState<number | null>(null);
```

- [ ] **Step 2: Update `finalTotal` and add `effectiveCouponDiscount`**

Replace lines 324–325:

```ts
const couponDiscount = coupon ? Math.round(totals.total * (coupon.discountPct / 100)) : 0;
const finalTotal = totals.total - couponDiscount;
```

with:

```ts
const couponDiscount = coupon ? Math.round(totals.total * (coupon.discountPct / 100)) : 0;
// effectiveCouponDiscount: uses Medusa's confirmed discount once preload resolves;
// falls back to frontend estimate while preload is in flight.
const effectiveCouponDiscount =
  medusaCartTotal !== null ? Math.max(0, totals.total - medusaCartTotal) : couponDiscount;
const finalTotal = medusaCartTotal ?? totals.total - couponDiscount;
```

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/app/[locale]/checkout/page.tsx
git commit -m "feat(checkout): add medusaCartTotal state for Medusa-sourced discount"
```

---

## Task 3: Apply coupon during preload

**Files:**
- Modify: `apps/storefront/app/[locale]/checkout/page.tsx`

The promotion must be applied to the Medusa cart **before** `createPaymentSession`. Applying it during preload (while the user fills the form) means the cart is ready and `createPaymentSession` will see the correct discounted total.

- [ ] **Step 1: Apply promotion after items are preloaded**

In the preload `useEffect`, locate this block (around line 487–488):

```ts
        itemsPreloaded.current = true;
      } catch { /* se creará en handleSubmit como fallback */ }
```

Replace with:

```ts
        itemsPreloaded.current = true;

        // Apply coupon if present — so createPaymentSession sees the discounted total
        if (coupon?.code) {
          try {
            const updatedCart = await medusa.cart.applyPromotion(cartId, coupon.code);
            if (updatedCart.discount_total && updatedCart.discount_total > 0) {
              setMedusaCartTotal(updatedCart.total);
              couponAppliedInPreload.current = true;
            }
          } catch {
            // Failed during preload — will retry on submit
          }
        }
      } catch { /* se creará en handleSubmit como fallback */ }
```

- [ ] **Step 2: Manual verify — preload applies coupon**

1. Apply coupon `TEST 25` in the drawer, navigate to `/checkout`.
2. Open DevTools Console.
3. After `[Checkout] preload: Xms` appears, confirm no error.
4. In the order summary, the coupon discount should update immediately from the estimate to the Medusa-confirmed value (they should match for a simple percentage coupon).

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/app/[locale]/checkout/page.tsx
git commit -m "feat(checkout): apply coupon promotion during preload"
```

---

## Task 4: Remove silent swallow — surface coupon errors on submit

**Files:**
- Modify: `apps/storefront/app/[locale]/checkout/page.tsx`

- [ ] **Step 1: Replace the silent try-catch with a verification gate**

Locate step 2c in `handleSubmit` (around line 629–637):

```ts
        // ── Paso 2c: Aplicar cupón de descuento si existe ──────────────────
        if (coupon?.code) {
          try {
            await medusa.cart.applyPromotion(cart_id!, coupon.code);
          } catch (promoErr) {
            // No bloquear el checkout si el cupón falla (puede haber expirado)
            console.warn("[Checkout] No se pudo aplicar el cupón:", promoErr);
          }
        }
```

Replace with:

```ts
        // ── Paso 2c: Aplicar cupón de descuento si existe ──────────────────
        // Skip if already applied during preload; otherwise apply now and verify.
        if (coupon?.code && !couponAppliedInPreload.current) {
          const updatedCart = await medusa.cart.applyPromotion(cart_id!, coupon.code);
          if (!updatedCart.discount_total || updatedCart.discount_total === 0) {
            setSubmitError("El cupón no pudo aplicarse. Verifica el código e intenta de nuevo.");
            setSubmitting(false);
            setPaymentStep(0);
            return;
          }
        }
```

Any error thrown by `applyPromotion` (network error, 4xx from Medusa) now propagates to the outer catch block (around line 656), which already handles it correctly: shows the error to the user and resets payment state.

- [ ] **Step 2: Commit**

```bash
git add apps/storefront/app/[locale]/checkout/page.tsx
git commit -m "fix(checkout): surface coupon errors instead of swallowing them silently"
```

---

## Task 5: Update UI to show Medusa-sourced discount

**Files:**
- Modify: `apps/storefront/app/[locale]/checkout/page.tsx`

- [ ] **Step 1: Update the coupon discount line in the order summary**

Locate (around line 1282–1296):

```tsx
                {coupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-[13px]">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                        style={{ background: "#16A34A" }}
                      >
                        CUPÓN
                      </span>
                      {coupon.code}
                    </span>
                    <span className="font-bold text-[#16A34A]">
                      −{fmt(couponDiscount)}
                    </span>
                  </div>
                )}
```

Replace with:

```tsx
                {coupon && effectiveCouponDiscount > 0 && (
                  <div className="flex justify-between text-[13px]">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                        style={{ background: "#16A34A" }}
                      >
                        CUPÓN
                      </span>
                      {coupon.code}
                    </span>
                    <span className="font-bold text-[#16A34A]">
                      −{fmt(effectiveCouponDiscount)}
                    </span>
                  </div>
                )}
```

- [ ] **Step 2: Update the savings comparison line**

Locate (around line 1308):

```tsx
                    {(totals.savings > 0 || couponDiscount > 0) && (
```

Replace with:

```tsx
                    {(totals.savings > 0 || effectiveCouponDiscount > 0) && (
```

- [ ] **Step 3: Update the PostHog `order_completed` event**

Locate (around line 675–678):

```ts
      posthog.capture("order_completed", {
        cart_total: finalTotal,
        item_count: items.reduce((sum, i) => sum + i.quantity, 0),
      });
```

Replace with:

```ts
      posthog.capture("order_completed", {
        cart_total: finalTotal + 85, // actual charge: discounted products + shipping
        item_count: items.reduce((sum, i) => sum + i.quantity, 0),
      });
```

- [ ] **Step 4: Manual verify — end-to-end test in production**

1. Deploy to Vercel (or test against production Medusa URL locally via `.env.production`).
2. Add a product to cart, apply coupon `TEST 25`.
3. Navigate to `/checkout`. Confirm the order summary shows:
   - Coupon line: `TEST 25  −$XX` (25% of product total, not of shipping)
   - Total: discounted product total + $85 shipping
4. Complete a test payment with a sandbox card.
5. Confirm Openpay charged the discounted amount (not the full amount).
6. Confirm the Medusa order shows `discount_total > 0`.

- [ ] **Step 5: Commit**

```bash
git add apps/storefront/app/[locale]/checkout/page.tsx
git commit -m "fix(checkout): use Medusa cart total as source of truth for coupon discount display and charge"
```

---

## Backend Pre-Requisite (out of scope for this plan)

Verify in the Medusa admin that the `TEST 25` promotion has `application_method.target_type: "items"` — not `"order"` or `"shipping_methods"`. This is what prevents the discount from applying to shipping. If it's misconfigured, the coupon will apply to the shipping cost even after these frontend changes.

---

## Verification Checklist

After all tasks:

- [ ] Coupon survives a hard refresh of `/checkout`
- [ ] Order summary shows the same discount before and after refresh
- [ ] Submitting with a valid coupon does not show a coupon error
- [ ] Submitting with an invalid coupon (after clearing localStorage and entering a bad code manually) shows a visible error in the UI — payment does not proceed
- [ ] Openpay sandbox charge matches the discounted total shown in the UI
- [ ] Shipping cost ($85) is never discounted by the coupon
