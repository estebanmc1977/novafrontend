# Spec: Coupon Discount Fix — Medusa as Source of Truth

**Date:** 2026-04-14  
**Branch:** feature/openpay-3ds  
**Status:** Approved

---

## Problem

Discount coupons display correctly in the frontend (CartDrawer + checkout summary) but the actual charge via Openpay is for the full price. The coupon code under test is `TEST 25` (25% off products, not shipping).

**Root cause:** The frontend calculates the discount independently (`total × discountPct / 100`) and displays it in the UI. The `applyPromotion()` call is made during `handleSubmit` but its result is never verified — errors are swallowed silently. If Medusa doesn't update the cart total (for any reason), `createPaymentSession` captures the full undiscounted total and Openpay charges that amount.

---

## Design: Medusa as Source of Truth

The frontend stops computing the final total independently. Instead, after applying the promotion, the cart total is read directly from Medusa's response and used as the authoritative amount for both display and payment.

### Shipping exclusion

The promotion must be configured in Medusa backend with `application_method.target_type: "items"` — this ensures it applies to line items only, not to shipping methods. This is a backend concern; no frontend logic needed to enforce it.

---

## Changes by File

### `contexts/CartContext.tsx`

**Persist coupon to localStorage.**

Today the coupon lives only in React state. If the user refreshes the checkout page, the coupon is lost and `applyPromotion` is never called, so the full price is charged.

- `applyCoupon(c)` → also writes `novapatch_coupon` to localStorage (JSON-serialized `AppliedCoupon`).
- `removeCoupon()` → also removes `novapatch_coupon` from localStorage.
- On mount, read `novapatch_coupon` from localStorage to rehydrate state.

---

### `app/[locale]/checkout/page.tsx`

**1. New state: `medusaCartTotal`**

```ts
const [medusaCartTotal, setMedusaCartTotal] = useState<number | null>(null);
```

This holds the product total as reported by Medusa after the promotion is applied. It does not include shipping (shipping is added on submit). It is `null` until the preload resolves the promotion.

**2. Preload `useEffect` — apply coupon early**

After items are added to the Medusa cart, if `coupon?.code` is present:

```ts
const updatedCart = await medusa.cart.applyPromotion(cartId, coupon.code);
if (updatedCart.discount_total && updatedCart.discount_total > 0) {
  setMedusaCartTotal(updatedCart.total);
  couponAppliedInPreload.current = true;
}
```

Use a `couponAppliedInPreload` ref (like `itemsPreloaded`) to avoid re-applying on submit.

**3. Submit `handleSubmit` — verify, don't swallow**

Step 2c becomes:

```ts
if (coupon?.code && !couponAppliedInPreload.current) {
  // Coupon wasn't applied during preload (e.g. user applied it after page load)
  const updatedCart = await medusa.cart.applyPromotion(cart_id!, coupon.code);
  if (!updatedCart.discount_total || updatedCart.discount_total === 0) {
    setSubmitError("El cupón no pudo aplicarse. Verifica el código e intenta de nuevo.");
    setSubmitting(false);
    return;
  }
}
```

Errors from `applyPromotion` propagate to the outer catch — no inner try-catch. If it throws, the user sees the error and the payment does not proceed.

**4. UI — show Medusa total**

In the order summary panel, the line that shows the coupon discount:

- If `medusaCartTotal !== null`: derive the displayed discount as `frontendProductTotal - medusaCartTotal` (difference between raw product total and Medusa's discounted total). This matches exactly what will be charged.
- If `medusaCartTotal === null` (preload still running or no coupon): keep the current frontend-calculated fallback display.

The `finalTotal` displayed to the user (products after discount + shipping) becomes:
```ts
const displayTotal = (medusaCartTotal ?? (totals.total - couponDiscount)) + shippingCost;
```

**5. PostHog `order_completed` event**

Update `cart_total` to use `displayTotal` (which reflects the actual charge) instead of `finalTotal`.

---

## What Does NOT Change

- `lib/medusa.ts` — no signature changes. `applyPromotion` already returns `MedusaCart` with `discount_total`.
- `CartDrawer.tsx` — coupon validation flow (`applyDiscountCode`) unchanged. Only `applyCoupon`/`removeCoupon` gain localStorage side effects.
- The Medusa backend — no changes needed beyond verifying `target_type: "items"` on the promotion.

---

## Error States

| Scenario | Behavior |
|---|---|
| `applyPromotion` throws (network / 4xx) | Error visible in checkout UI, payment blocked |
| `applyPromotion` succeeds but `discount_total === 0` | Error visible: "El cupón no pudo aplicarse" |
| Coupon in localStorage but expired | `applyPromotion` throws → error shown, localStorage entry cleared |
| User refreshes checkout page with coupon active | Coupon rehydrated from localStorage, applied in next preload |

---

## Out of Scope

- Coupon validation UX in CartDrawer (unchanged)
- Multiple coupon codes
- Promotion stacking rules
- Brazil / MercadoPago path
