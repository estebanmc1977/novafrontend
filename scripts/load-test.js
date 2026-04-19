// novafrontend/scripts/load-test.js
// Run: k6 run scripts/load-test.js --env BASE_URL=https://www.novapatch.care --env BACKEND_URL=https://<railway-url> --env PUBLISHABLE_KEY=<key>
import http from "k6/http"
import { check, sleep } from "k6"
import { Rate, Trend } from "k6/metrics"

const errorRate = new Rate("errors")
const cartDuration = new Trend("cart_creation_duration")

export const options = {
  vus: 50,
  duration: "60s",
  thresholds: {
    http_req_duration: ["p(95)<3000"],
    errors: ["rate<0.01"],
  },
}

const BASE_URL = __ENV.BASE_URL || "https://www.novapatch.care"
const BACKEND_URL = __ENV.BACKEND_URL  // required: pass --env BACKEND_URL=https://your-backend.railway.app
const PUBLISHABLE_KEY = __ENV.PUBLISHABLE_KEY || ""

export default function () {
  const tiendaRes = http.get(`${BASE_URL}/mx/tienda`)
  check(tiendaRes, {
    "tienda status 200": (r) => r.status === 200,
  })
  errorRate.add(tiendaRes.status !== 200)
  sleep(0.5)

  const productsRes = http.get(`${BACKEND_URL}/store/products?limit=10`, {
    headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
  })
  check(productsRes, {
    "products status 200": (r) => r.status === 200,
    "products has data": (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.products?.length > 0
      } catch {
        return false
      }
    },
  })
  errorRate.add(productsRes.status !== 200)
  sleep(0.5)

  const regionsRes = http.get(`${BACKEND_URL}/store/regions`, {
    headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
  })
  const regionId = JSON.parse(regionsRes.body)?.regions?.[0]?.id
  if (!regionId) {
    errorRate.add(1)
    return
  }
  sleep(0.3)

  const cartStart = Date.now()
  const cartRes = http.post(
    `${BACKEND_URL}/store/carts`,
    JSON.stringify({ region_id: regionId }),
    { headers: { "Content-Type": "application/json", "x-publishable-api-key": PUBLISHABLE_KEY } }
  )
  cartDuration.add(Date.now() - cartStart)
  check(cartRes, {
    "cart created 200": (r) => r.status === 200,
  })
  errorRate.add(cartRes.status !== 200)

  const cartId = JSON.parse(cartRes.body)?.cart?.id
  if (!cartId) return
  sleep(0.3)

  const products = JSON.parse(productsRes.body)?.products ?? []
  const variantId = products[0]?.variants?.[0]?.id
  if (!variantId) return

  const lineItemRes = http.post(
    `${BACKEND_URL}/store/carts/${cartId}/line-items`,
    JSON.stringify({ variant_id: variantId, quantity: 1 }),
    { headers: { "Content-Type": "application/json", "x-publishable-api-key": PUBLISHABLE_KEY } }
  )
  check(lineItemRes, {
    "line item added 200": (r) => r.status === 200,
  })
  errorRate.add(lineItemRes.status !== 200)

  sleep(1)
}
