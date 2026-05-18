// novafrontend/apps/storefront/tests/e2e/smoke/full-checkout.spec.ts
//
// L4 smoke: full happy-path against PRODUCTION with a synthetic transaction.
// Tokenizes the founder's card, applies SMOKE_PROMO_CODE (99% off + free
// shipping), completes checkout, polls Openpay webhook arrival, asserts
// order shape, then cancels the order. Cost per run: ~$1-5 MXN residual.
//
// Backend safeguards (must be deployed before running):
//   - envia-fulfillment subscriber skips orders where metadata.smoke_test=true
//   - mapPaymentCapturedToSlackBlocks prepends 🧪 [SMOKE] to the header
//
// Spec: novabackend/docs/superpowers/specs/2026-05-17-smoke-l4-full-checkout-design.md

import { test, expect, type APIRequestContext } from "@playwright/test"
import { createOpenpayToken } from "./helpers/openpay-token"

const BACKEND_URL = process.env.BACKEND_URL ?? "https://admin.novapatch.care"
const PUBLISHABLE_KEY =
  process.env.PUBLISHABLE_API_KEY ??
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ??
  ""
const ADMIN_API_KEY = process.env.PROD_ADMIN_API_KEY ?? ""
const PROMO_CODE = process.env.SMOKE_PROMO_CODE ?? ""
const VARIANT_ID = process.env.SMOKE_VARIANT_ID ?? ""

const OPENPAY_MERCHANT_ID = process.env.SMOKE_OPENPAY_MERCHANT_ID ?? ""
const OPENPAY_PRIVATE_KEY = process.env.SMOKE_OPENPAY_PRIVATE_KEY ?? ""
const OPENPAY_API_BASE = "https://api.openpay.mx/v1"

const SMOKE_CARD = {
  cardNumber: process.env.SMOKE_CARD_NUMBER ?? "",
  cvv: process.env.SMOKE_CARD_CVV ?? "",
  expirationMonth: process.env.SMOKE_CARD_EXP_MONTH ?? "",
  expirationYear: process.env.SMOKE_CARD_EXP_YEAR ?? "",
  holderName: process.env.SMOKE_CARD_HOLDER_NAME ?? "",
}

const SMOKE_EMAIL = "smoke@novapatch.care"

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

function adminApi(request: APIRequestContext, path: string, init?: { method?: string; data?: unknown }) {
  return request.fetch(`${BACKEND_URL}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "x-medusa-access-token": ADMIN_API_KEY,
    },
    data: init?.data as any,
  })
}

async function cancelOrder(request: APIRequestContext, orderId: string): Promise<void> {
  const res = await adminApi(request, `/admin/orders/${orderId}/cancel`, { method: "POST" })
  if (!res.ok()) {
    throw new Error(`Failed to cancel order ${orderId}: ${res.status()} ${await res.text()}`)
  }
}

test.describe("full-checkout smoke (L4) — PRODUCTION, real charge", () => {
  test.skip(
    !PUBLISHABLE_KEY || !ADMIN_API_KEY || !PROMO_CODE || !VARIANT_ID ||
    !OPENPAY_MERCHANT_ID || !OPENPAY_PRIVATE_KEY || !SMOKE_CARD.cardNumber,
    "Missing one of: PUBLISHABLE_API_KEY, PROD_ADMIN_API_KEY, SMOKE_PROMO_CODE, SMOKE_VARIANT_ID, SMOKE_OPENPAY_MERCHANT_ID, SMOKE_OPENPAY_PRIVATE_KEY, SMOKE_CARD_*"
  )

  test("real charge + webhook + order + cancel completes end-to-end", async ({ request }) => {
    test.setTimeout(180_000)  // 3 min: includes 60s webhook polling

    let orderId: string | null = null

    try {
      // ── 1. Resolve region + create cart with smoke flag ──────────────────────
      const regionsRes = await api(request, "/store/regions")
      expect(regionsRes.status()).toBe(200)
      const { regions } = await regionsRes.json()
      const mxRegion = regions.find((r: any) =>
        r.countries?.some((c: any) => c.iso_2 === "mx")
      ) ?? regions[0]
      expect(mxRegion?.id, "MX region must exist").toBeTruthy()

      const createCartRes = await api(request, "/store/carts", {
        method: "POST",
        data: {
          region_id: mxRegion.id,
          email: SMOKE_EMAIL,
          metadata: { smoke_test: true },
        },
      })
      expect(createCartRes.status()).toBe(200)
      const { cart } = await createCartRes.json()
      const cartId = cart.id

      // ── 2. Add line item ─────────────────────────────────────────────────────
      const addItemRes = await api(request, `/store/carts/${cartId}/line-items`, {
        method: "POST",
        data: { variant_id: VARIANT_ID, quantity: 1 },
      })
      expect(addItemRes.status(), "add item should succeed").toBe(200)

      // ── 3. Set shipping address ──────────────────────────────────────────────
      const updateRes = await api(request, `/store/carts/${cartId}`, {
        method: "POST",
        data: {
          shipping_address: TEST_SHIPPING_ADDRESS,
          email: SMOKE_EMAIL,
        },
      })
      expect(updateRes.status(), "set address should succeed").toBe(200)

      // ── 4. Apply the discount + free-shipping promos ─────────────────────────
      // SMOKE_PROMO_CODE is comma-separated: typically one code for product
      // discount and one for free shipping (Medusa v2 = one application
      // method per promo, so two promos stacked).
      const promoCodes = PROMO_CODE.split(",").map((c) => c.trim()).filter(Boolean)
      const promoRes = await api(request, `/store/carts/${cartId}/promotions`, {
        method: "POST",
        data: { promo_codes: promoCodes },
      })
      expect(promoRes.status(), `apply promos should succeed (check promos not expired): ${promoCodes.join(", ")}`).toBe(200)

      // ── 5. Apply shipping method ─────────────────────────────────────────────
      const shippingRes = await api(
        request,
        `/store/shipping-options?cart_id=${encodeURIComponent(cartId)}`
      )
      expect(shippingRes.status()).toBe(200)
      const { shipping_options } = await shippingRes.json()
      expect(shipping_options?.length, "at least one shipping option").toBeGreaterThan(0)

      const applyShippingRes = await api(
        request,
        `/store/carts/${cartId}/shipping-methods`,
        {
          method: "POST",
          data: { option_id: shipping_options[0].id },
        }
      )
      expect(applyShippingRes.status()).toBe(200)
      const { cart: cartWithShipping } = await applyShippingRes.json()
      // Sanity: with 99% off + free shipping, total should be ≤ 30 MXN.
      // If this fails the promo isn't applying correctly (huge cost risk).
      expect(
        cartWithShipping.total,
        `cart total should be ≤ 30 MXN after promo (actual: ${cartWithShipping.total})`
      ).toBeLessThanOrEqual(3000)  // Medusa stores totals in cents

      // ── 6. Create payment session ────────────────────────────────────────────
      const paymentSessRes = await api(
        request,
        `/store/carts/${cartId}/payment-sessions`,
        { method: "POST" }
      )
      expect(paymentSessRes.status()).toBe(200)

      // ── 7. Tokenize card via Openpay ─────────────────────────────────────────
      const openpayTokenId = await createOpenpayToken({
        merchantId: OPENPAY_MERCHANT_ID,
        privateKey: OPENPAY_PRIVATE_KEY,
        card: SMOKE_CARD,
        apiBaseUrl: OPENPAY_API_BASE,
      })
      expect(openpayTokenId, "Openpay token should be created").toBeTruthy()

      // ── 8. Complete checkout — REAL CHARGE HAPPENS HERE ──────────────────────
      // device_session_id is required by Openpay's antifraud — in the browser
      // it comes from their SDK; from a server-side test we synthesize a UUID
      // since we're not actually doing device fingerprinting.
      const completeRes = await api(request, `/store/carts/${cartId}/complete`, {
        method: "POST",
        data: {
          openpay_token_id: openpayTokenId,
          device_session_id: crypto.randomUUID().replace(/-/g, ""),
        },
      })
      expect(completeRes.status(), `complete should succeed: ${await completeRes.text()}`).toBe(200)
      const completeBody = await completeRes.json()

      // Detect 3DS redirect — would fail the smoke since we can't complete 3DS
      // unattended. If this happens, we need to either disable 3DS for this
      // promo amount or accept the test gets skipped.
      if (completeBody.type === "redirect") {
        throw new Error("Openpay required 3DS redirect — smoke cannot complete unattended. Lower amount or whitelist customer.")
      }

      orderId = completeBody?.order?.id ?? completeBody?.id ?? null
      expect(orderId, "complete should return an order id").toBeTruthy()
      if (!orderId) throw new Error("orderId is null after complete — unreachable")

      // ── 9. Poll until payment_captured (webhook arrival) ─────────────────────
      const POLL_INTERVAL_MS = 5_000
      const POLL_TIMEOUT_MS = 60_000
      const start = Date.now()
      let order: any = null
      while (Date.now() - start < POLL_TIMEOUT_MS) {
        const orderRes = await adminApi(request, `/admin/orders/${orderId}`)
        if (orderRes.status() === 200) {
          const body = await orderRes.json()
          order = body.order
          if (order?.payment_status === "captured") break
        } else {
          console.warn(`[smoke L4] polling /admin/orders/${orderId} returned ${orderRes.status()} — retrying`)
        }
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
      }

      expect(
        order?.payment_status,
        `Openpay webhook did not result in payment_status=captured within ${POLL_TIMEOUT_MS / 1000}s. ` +
        `Check webhook config in Openpay dashboard or the captured-payment subscriber. Last seen status: ${order?.payment_status}`
      ).toBe("captured")

      // ── 10. Assert order shape ───────────────────────────────────────────────
      expect(order.email, "order email should be smoke address").toBe(SMOKE_EMAIL)
      expect(
        order.metadata?.smoke_test,
        "smoke_test metadata MUST propagate from cart to order (else Envia guard fails)"
      ).toBe(true)
      expect(order.items?.length, "order should have 1 item").toBe(1)

      // ── 11. Cancel order ─────────────────────────────────────────────────────
      await cancelOrder(request, orderId)

      // ── 12. Verify canceled ──────────────────────────────────────────────────
      const afterCancelRes = await adminApi(request, `/admin/orders/${orderId}`)
      expect(afterCancelRes.status()).toBe(200)
      const { order: canceled } = await afterCancelRes.json()
      expect(canceled.status, "order should be canceled").toBe("canceled")

    } catch (err) {
      // Best-effort cleanup: if test dies after order creation, try to cancel
      if (orderId !== null) {
        const _orderId = orderId
        try {
          await cancelOrder(request, _orderId)
          console.log(`[smoke L4] Best-effort cancel succeeded for order ${_orderId}`)
        } catch (cancelErr) {
          console.error(`[smoke L4] CRITICAL: order ${_orderId} NOT canceled — manual cleanup required. Reason: ${cancelErr instanceof Error ? cancelErr.message : String(cancelErr)}`)
        }
      }
      throw err
    }
  })
})
