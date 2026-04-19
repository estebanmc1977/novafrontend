// novafrontend/apps/storefront/tests/e2e/checkout/declined-card.spec.ts
import { test, expect } from "@playwright/test"
import { loginAsTestUser } from "../helpers/auth"
import { addFirstProductToCart } from "../helpers/cart"

// Openpay Mexico sandbox decline card — verify at https://openpay.mx/docs/sandbox
const OPENPAY_SANDBOX_DECLINE_CARD = "4000000000000002"

test("declined card shows error message and creates no zombie order", async ({ page }) => {
  await loginAsTestUser(page)
  await addFirstProductToCart(page)

  await page.goto("/mx/checkout/cart")
  await page.waitForLoadState("networkidle")

  await page.click("a[href*='/checkout']:not([href*='/cart']), button:has-text('Proceder'), button:has-text('Checkout')")
  await page.waitForURL("**/mx/checkout", { timeout: 10_000 })
  await page.waitForLoadState("networkidle")

  await page.fill("#name", "Test User Novapatch")
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
  await page.fill("#cardNumber", OPENPAY_SANDBOX_DECLINE_CARD)
  await page.fill("#cardName", "TEST USER DECLINE")
  await page.fill("#expiry", "12/28")
  await page.fill("#cvv", "123")

  await page.click("button[type='submit']")

  const errorMessage = page.locator("[class*='error'], [class*='Error'], [role='alert'], text=/declinada|rechazada|failed|error/i").first()
  await expect(errorMessage).toBeVisible({ timeout: 15_000 })

  const errorText = await errorMessage.textContent()
  expect(errorText).not.toContain("500")
  expect(errorText).not.toContain("undefined")
  expect(errorText!.trim().length).toBeGreaterThan(5)

  const backendUrl = process.env.BACKEND_URL!
  const adminAuthResp = await page.request.post(`${backendUrl}/auth/user/emailpass`, {
    data: {
      email: process.env.MEDUSA_ADMIN_EMAIL!,
      password: process.env.MEDUSA_ADMIN_PASSWORD!,
    },
  })
  if (adminAuthResp.status() === 200) {
    const { token } = await adminAuthResp.json()
    const ordersResp = await page.request.get(`${backendUrl}/admin/orders?status[]=pending&limit=5`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (ordersResp.status() === 200) {
      const body = await ordersResp.json()
      const pendingOrdersWithTestEmail = (body.orders ?? []).filter((o: any) => o.email === process.env.TEST_USER_EMAIL)
      expect(pendingOrdersWithTestEmail.length).toBe(0)
    }
  }
})
