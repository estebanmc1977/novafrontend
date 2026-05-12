// novafrontend/apps/storefront/tests/e2e/smoke/pre-checkout.spec.ts
//
// Walks the full purchase funnel UP TO — but not including — the final
// /complete call. No real charge is made; no order is created. The goal
// is to validate that every integration in the path is wired correctly:
//
//   1. Medusa /store/products responds with at least one product
//   2. Cart create works
//   3. Line item add works
//   4. Cart can be updated with email + shipping_address
//   5. /store/shipping-options responds (this is the backend↔Envia handshake —
//      the most important signal that real shipping cost will be calculable)
//   6. A shipping method can be applied to the cart
//   7. /store/carts/:id/payment-sessions creates the Openpay session
//      (validates backend↔Openpay credentials and provider config)
//
// What this DOES NOT validate:
//   - That a real card actually charges (would require Openpay sandbox card
//     or a $1 real charge + refund — see notes in the comment trail)
//   - Webhook delivery, order creation, email/Slack/Envia fulfillment
//
// Run locally:
//   BACKEND_URL=https://admin.novapatch.care \
//   PUBLISHABLE_API_KEY=pk_... \
//   pnpm test:e2e:smoke
//
// Run in CI: see .github/workflows/smoke.yml — secrets must include
// BACKEND_URL and PUBLISHABLE_API_KEY.

import { test, expect, type APIRequestContext } from "@playwright/test"

const BACKEND_URL =
  process.env.BACKEND_URL ?? "https://admin.novapatch.care"
const PUBLISHABLE_KEY =
  process.env.PUBLISHABLE_API_KEY ??
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ??
  ""

// MX region — the only one in prod today. If we later add AR/BR these
// smokes should be parameterized per locale.
const TEST_SHIPPING_ADDRESS = {
  first_name: "Smoke",
  last_name: "Test",
  address_1: "Av. Álvaro Obregón 100",
  address_2: "Roma Norte",
  city: "Cuauhtémoc",
  province: "CDMX",
  country_code: "mx",
  postal_code: "06700",
  phone: "+525500000000",
}

function api(request: APIRequestContext, path: string, init?: { method?: string; data?: unknown }) {
  return request.fetch(`${BACKEND_URL}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": PUBLISHABLE_KEY,
    },
    data: init?.data as any,
  })
}

test.describe("pre-checkout funnel — validates the path up to payment", () => {
  test.skip(
    !PUBLISHABLE_KEY,
    "PUBLISHABLE_API_KEY (or NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) must be set"
  )

  test("full pre-checkout flow ends with a created payment session", async ({ request }) => {
    // ── 1. Pull a real variant to add to the cart ────────────────────────────
    const productsRes = await api(request, "/store/products?limit=1")
    expect(productsRes.status(), "products endpoint should return 200").toBe(200)
    const { products } = await productsRes.json()
    expect(products?.length, "products list should not be empty").toBeGreaterThan(0)
    const variant = products[0].variants?.[0]
    expect(variant?.id, "first product should have at least one variant").toBeTruthy()

    // Resolve a region id from the variant's prices (any one works for this test).
    const regionsRes = await api(request, "/store/regions")
    expect(regionsRes.status()).toBe(200)
    const { regions } = await regionsRes.json()
    const mxRegion = regions.find((r: any) =>
      r.countries?.some((c: any) => c.iso_2 === "mx")
    ) ?? regions[0]
    expect(mxRegion?.id, "should have an MX region configured").toBeTruthy()

    // ── 2. Create cart ───────────────────────────────────────────────────────
    const createCartRes = await api(request, "/store/carts", {
      method: "POST",
      data: { region_id: mxRegion.id },
    })
    expect(createCartRes.status(), "cart create should return 200").toBe(200)
    const { cart } = await createCartRes.json()
    expect(cart?.id, "new cart should have an id").toBeTruthy()
    const cartId = cart.id

    // ── 3. Add line item ─────────────────────────────────────────────────────
    const addItemRes = await api(request, `/store/carts/${cartId}/line-items`, {
      method: "POST",
      data: { variant_id: variant.id, quantity: 1 },
    })
    expect(addItemRes.status(), "add line item should return 200").toBe(200)
    const { cart: cartWithItem } = await addItemRes.json()
    expect(cartWithItem?.items?.length, "cart should have exactly 1 line item").toBe(1)

    // ── 4. Update cart with email + shipping address ─────────────────────────
    const updateRes = await api(request, `/store/carts/${cartId}`, {
      method: "POST",
      data: {
        email: "smoke-test@novapatch.care",
        shipping_address: TEST_SHIPPING_ADDRESS,
      },
    })
    expect(updateRes.status(), "update cart with address should return 200").toBe(200)
    const { cart: cartWithAddress } = await updateRes.json()
    expect(
      cartWithAddress?.shipping_address?.postal_code,
      "address should have persisted"
    ).toBe(TEST_SHIPPING_ADDRESS.postal_code)

    // ── 5. Shipping options — the critical Envia handshake ───────────────────
    // If Envia is down or our backend ↔ Envia integration is broken, this
    // is the step that fails. Real users would get an empty list and not be
    // able to check out.
    const shippingRes = await api(
      request,
      `/store/shipping-options?cart_id=${encodeURIComponent(cartId)}`
    )
    expect(shippingRes.status(), "shipping-options should return 200").toBe(200)
    const { shipping_options } = await shippingRes.json()
    expect(
      shipping_options?.length,
      "at least one shipping option should be available (Envia integration check)"
    ).toBeGreaterThan(0)
    const cheapestOption = shipping_options[0]
    expect(cheapestOption?.id, "shipping option should have an id").toBeTruthy()

    // ── 6. Apply shipping method ────────────────────────────────────────────
    const applyShippingRes = await api(
      request,
      `/store/carts/${cartId}/shipping-methods`,
      {
        method: "POST",
        data: { option_id: cheapestOption.id },
      }
    )
    expect(applyShippingRes.status(), "apply shipping method should return 200").toBe(200)
    const { cart: cartWithShipping } = await applyShippingRes.json()
    expect(
      cartWithShipping?.shipping_methods?.length,
      "cart should now have a shipping method"
    ).toBeGreaterThan(0)

    // ── 7. Create payment session — the Openpay handshake ────────────────────
    // This validates backend ↔ Openpay credentials + provider config without
    // actually charging anything. The next step in the real flow would be
    // POST /complete with an Openpay token, which we deliberately skip.
    const paymentRes = await api(
      request,
      `/store/carts/${cartId}/payment-sessions`,
      { method: "POST" }
    )
    expect(paymentRes.status(), "create payment session should return 200").toBe(
      200
    )
    const { cart: cartWithPayment } = await paymentRes.json()
    expect(
      cartWithPayment?.payment_collection ?? cartWithPayment?.payment_session ?? cartWithPayment?.payment_sessions,
      "payment session/collection should be attached to the cart"
    ).toBeTruthy()

    // Done — STOP here. /complete would create a real order + charge.
  })

  test("homepage and /tienda render server-side without 500", async ({ request }) => {
    const baseUrl = process.env.BASE_URL ?? "https://www.novapatch.care"
    const home = await request.get(baseUrl)
    expect(home.status(), `${baseUrl} should be 2xx/3xx`).toBeLessThan(400)

    const tienda = await request.get(`${baseUrl}/tienda`)
    expect(tienda.status(), "/tienda should be 2xx/3xx").toBeLessThan(400)
  })
})
