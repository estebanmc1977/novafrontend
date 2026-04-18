# Checkout: Número Interior e Indicaciones de Entrega

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add optional "Número interior" and "Indicaciones de entrega" fields to the checkout shipping address form, propagating them to the carrier label via Medusa.

**Architecture:** Both fields extend the existing `address` state in the single checkout page file. On submit, `número interior` is appended to `address_1` and `indicaciones de entrega` to `address_2` (conditionally, only when filled), and both are also stored in `cart.metadata` for structured access. The `medusa.ts` cart update type is extended to accept `metadata`.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Medusa V2 REST API (`POST /store/carts/:id`), Tailwind CSS v4.

---

## File Map

| File | Change |
|------|--------|
| `apps/storefront/lib/medusa.ts` | Add `metadata` to `cart.update()` fields type |
| `apps/storefront/app/[locale]/checkout/page.tsx` | State + UI fields + Medusa payload |

---

### Task 1: Extend `medusa.ts` cart update type

**Files:**
- Modify: `apps/storefront/lib/medusa.ts:309-331`

The `cart.update()` function currently accepts `email` and `shipping_address`. TypeScript strict mode will reject passing `metadata` without it in the type signature.

- [ ] **Step 1: Add `metadata` to the update fields type**

In `apps/storefront/lib/medusa.ts`, find the `update` function (around line 309). Replace:

```typescript
  async update(
    cart_id: string,
    fields: {
      email?: string;
      shipping_address?: {
        first_name?: string;
        last_name?: string;
        address_1?: string;
        address_2?: string;
        city?: string;
        province?: string;
        postal_code?: string;
        country_code?: string;
        phone?: string;
      };
    }
  ): Promise<MedusaCart> {
```

With:

```typescript
  async update(
    cart_id: string,
    fields: {
      email?: string;
      shipping_address?: {
        first_name?: string;
        last_name?: string;
        address_1?: string;
        address_2?: string;
        city?: string;
        province?: string;
        postal_code?: string;
        country_code?: string;
        phone?: string;
      };
      metadata?: Record<string, unknown>;
    }
  ): Promise<MedusaCart> {
```

- [ ] **Step 2: Verify type check passes**

```bash
cd apps/storefront && pnpm run lint
```

Expected: no TypeScript errors in `lib/medusa.ts`.

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/lib/medusa.ts
git commit -m "feat(checkout): add metadata to medusa cart.update type"
```

---

### Task 2: Extend address state and add UI fields

**Files:**
- Modify: `apps/storefront/app/[locale]/checkout/page.tsx:330-336` (state)
- Modify: `apps/storefront/app/[locale]/checkout/page.tsx:959` (UI — insert after street field closing `</div>`)

- [ ] **Step 1: Extend the address state**

In `checkout/page.tsx`, find the `address` state (around line 330). Replace:

```typescript
  const [address, setAddress] = useState({
    street: "",
    colonia: "",
    city: "",
    state: "",
    zip: "",
  });
```

With:

```typescript
  const [address, setAddress] = useState({
    street: "",
    colonia: "",
    city: "",
    state: "",
    zip: "",
    interior: "",
    instructions: "",
  });
```

- [ ] **Step 2: Add the two UI fields after the street field**

Find the closing `</div>` of the street field block (after the `AnimatePresence` for `errors.street`, around line 959):

```tsx
                  </div>

                  {/* CP — dispara COPOMEX */}
```

Insert the two new field blocks between them:

```tsx
                  </div>

                  {/* Número interior — opcional */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="interior" className="text-[12px] font-bold text-[#005088] uppercase tracking-[0.06em]">
                      Número interior <span className="text-[#9CA3AF] font-normal normal-case">(opcional)</span>
                    </label>
                    <input
                      id="interior"
                      type="text"
                      placeholder="Ej. 4B, Depto 3"
                      value={address.interior}
                      onChange={(e) => setAddress((a) => ({ ...a, interior: e.target.value.slice(0, 20) }))}
                      autoComplete="address-line3"
                      className="w-full px-4 py-3 rounded-xl text-[14px] text-[#005088] placeholder-[#9CA3AF] border border-[#E5E7EB] bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-[#005088]/20 focus:border-[#005088]"
                    />
                  </div>

                  {/* Indicaciones de entrega — opcional */}
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label htmlFor="instructions" className="text-[12px] font-bold text-[#005088] uppercase tracking-[0.06em]">
                      Indicaciones de entrega <span className="text-[#9CA3AF] font-normal normal-case">(opcional)</span>
                    </label>
                    <textarea
                      id="instructions"
                      placeholder="Ej. Edificio azul, no llamar por teléfono"
                      value={address.instructions}
                      onChange={(e) => setAddress((a) => ({ ...a, instructions: e.target.value.slice(0, 200) }))}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl text-[14px] text-[#005088] placeholder-[#9CA3AF] border border-[#E5E7EB] bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-[#005088]/20 focus:border-[#005088] resize-none"
                    />
                    <p className="text-[10px] text-[#9CA3AF] text-right">{address.instructions.length}/200</p>
                  </div>

                  {/* CP — dispara COPOMEX */}
```

- [ ] **Step 3: Verify the dev server renders without errors**

```bash
cd apps/storefront && pnpm run dev
```

Open `http://localhost:3000` and navigate to checkout. Confirm the two new fields appear below "Calle y número" and above "Código postal". Both are optional — the form should still submit without filling them.

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/app/[locale]/checkout/page.tsx
git commit -m "feat(checkout): add interior number and delivery instructions fields"
```

---

### Task 3: Update Medusa cart.update() payload

**Files:**
- Modify: `apps/storefront/app/[locale]/checkout/page.tsx:629-642`

- [ ] **Step 1: Update the cart update call with conditional concatenation and metadata**

Find the `medusa.cart.update` call in `handleSubmit` (around line 629). Replace:

```typescript
        await medusa.cart.update(cart_id, {
          email: contact.email,
          shipping_address: {
            first_name: contact.name.split(" ")[0],
            last_name: contact.name.split(" ").slice(1).join(" ") || "",
            address_1: address.street,
            address_2: address.colonia,
            city: resolvedCity,
            province: resolvedState,
            postal_code: address.zip,
            country_code: "mx",
            phone: contact.phone,
          },
        });
```

With:

```typescript
        await medusa.cart.update(cart_id, {
          email: contact.email,
          shipping_address: {
            first_name: contact.name.split(" ")[0],
            last_name: contact.name.split(" ").slice(1).join(" ") || "",
            address_1: address.interior
              ? `${address.street} Int ${address.interior}`
              : address.street,
            address_2: address.instructions
              ? `${address.colonia} | ${address.instructions}`
              : address.colonia,
            city: resolvedCity,
            province: resolvedState,
            postal_code: address.zip,
            country_code: "mx",
            phone: contact.phone,
          },
          metadata: {
            numero_interior: address.interior || null,
            indicaciones_entrega: address.instructions || null,
          },
        });
```

- [ ] **Step 2: Verify type check and lint pass**

```bash
cd apps/storefront && pnpm run lint
```

Expected: no errors.

- [ ] **Step 3: Smoke test — submit a test order with and without the new fields**

Start the dev server and go through checkout with:
- **Case A:** Leave both new fields empty → `address_1` and `address_2` should be identical to before (no "Int " appended, no " | " separator).
- **Case B:** Fill in "4B" as interior → `address_1` becomes e.g. `"Insurgentes Sur 1234 Int 4B"`.
- **Case C:** Fill in instructions only → `address_2` becomes e.g. `"Del Valle | Edificio azul"`.

Verify in the browser's Network tab (`POST /store/carts/:id`) that the payload matches expectations for each case.

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/app/[locale]/checkout/page.tsx
git commit -m "feat(checkout): propagate interior and instructions to Medusa label fields"
```

---

## Notes

- **No test framework exists** (`pnpm run lint` + visual/network verification is the closest available).
- **SuccessScreen** (`checkout/page.tsx:269-301`) is a static generic screen with no address display — no changes needed there.
- **Order summary sidebar** (`checkout/page.tsx:1293-1398`) shows only items + totals — no address display — no changes needed.
- **Brazil region:** not yet implemented; these changes are Mexico-only by default (`country_code: "mx"`).
