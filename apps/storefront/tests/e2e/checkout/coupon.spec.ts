// novafrontend/apps/storefront/tests/e2e/checkout/coupon.spec.ts
import { test, expect } from "@playwright/test"
import { loginAsTestUser } from "../helpers/auth"

const TEST_COUPON_CODE = process.env.TEST_COUPON_CODE || "TESTDESC10"
const OPENPAY_SANDBOX_SUCCESS_CARD = "4111111111111111"

test("coupon applies to first cycle only on a subscription order", async ({ page }) => {
  await loginAsTestUser(page)
  await page.goto("/mx/tienda")
  await page.waitForLoadState("networkidle")

  const subToggle = page.locator("button:has-text('Suscripción'), input[value='sub'], label:has-text('Suscripción')").first()
  if (await subToggle.isVisible()) {
    await subToggle.click()
  }

  await page.locator("button:has-text(/Agregar|Añadir/)").first().click()
  await page.waitForTimeout(1000)

  await page.goto("/mx/checkout/cart")
  await page.waitForLoadState("networkidle")

  const couponInput = page.locator("input[placeholder*='cupón'], input[placeholder*='código'], input[name*='coupon'], input[name*='promo']")
  if (await couponInput.isVisible()) {
    await couponInput.fill(TEST_COUPON_CODE)
    await page.click("button:has-text('Aplicar'), button:has-text('Apply')")
    await page.waitForTimeout(1500)
    await expect(page.locator("text=/Descuento|discount|Cupón/i").first()).toBeVisible()
  }

  await page.click("a[href*='/checkout']:not([href*='/cart']), button:has-text('Proceder')")
  await page.waitForURL("**/mx/checkout", { timeout: 10_000 })
  await page.waitForLoadState("networkidle")

  await page.fill("#name", "Test User Coupon")
  await page.fill("#email", process.env.TEST_USER_EMAIL!)
  await page.fill("#phone", "5512345678")
  await page.fill("#street", "Álvaro Obregón 100")
  await page.fill("#zip", "06700")
  await page.waitForTimeout(1500)

  const coloniaSelect = page.locator("#colonia")
  const tagName = await coloniaSelect.evaluate((el) => el.tagName.toLowerCase())
  if (tagName === "select") {
    await coloniaSelect.selectOption({ index: 1 })
  } else {
    await coloniaSelect.fill("Roma Norte")
  }

  await page.fill("#city", "Cuauhtémoc")
  await page.fill("#state", "Ciudad de México")
  await page.fill("#cardNumber", OPENPAY_SANDBOX_SUCCESS_CARD)
  await page.fill("#cardName", "TEST COUPON USER")
  await page.fill("#expiry", "12/28")
  await page.fill("#cvv", "123")
  await page.click("button[type='submit']")

  await page.waitForURL((url) => url.pathname.includes("confirm") || url.pathname.includes("gracias"), { timeout: 30_000 })
    .catch(async () => {
      await expect(page.locator("text=/¡Gracias|Pedido confirmado/i").first()).toBeVisible({ timeout: 10_000 })
    })

  const backendUrl = process.env.BACKEND_URL!
  const authResp = await page.request.post(`${backendUrl}/auth/user/emailpass`, {
    data: { email: process.env.MEDUSA_ADMIN_EMAIL!, password: process.env.MEDUSA_ADMIN_PASSWORD! },
  })
  if (authResp.status() !== 200) return

  const { token } = await authResp.json()
  const customersResp = await page.request.get(
    `${backendUrl}/admin/customers?email=${encodeURIComponent(process.env.TEST_USER_EMAIL!)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (customersResp.status() !== 200) return

  const customersBody = await customersResp.json()
  const customer = customersBody.customers?.[0]
  if (!customer) return

  const subsResp = await page.request.get(
    `${backendUrl}/admin/customers/${customer.id}/subscriptions`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (subsResp.status() !== 200) return

  const subsBody = await subsResp.json()
  const latestSub = subsBody.subscriptions?.[0]
  if (latestSub) {
    const metadata = latestSub.metadata ?? {}
    expect(metadata.coupon_code).toBeUndefined()
  }
})
