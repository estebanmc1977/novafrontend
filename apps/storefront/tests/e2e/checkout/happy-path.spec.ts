// novafrontend/apps/storefront/tests/e2e/checkout/happy-path.spec.ts
import { test, expect } from "@playwright/test"
import { loginAsTestUser } from "../helpers/auth"
import { addFirstProductToCart } from "../helpers/cart"

// Openpay Mexico sandbox test cards — verify at https://openpay.mx/docs/sandbox
const OPENPAY_SANDBOX_SUCCESS_CARD = "4111111111111111"

test("completes a full purchase with Openpay sandbox success card", async ({ page }) => {
  await loginAsTestUser(page)
  await addFirstProductToCart(page)

  await page.goto("/mx/checkout/cart")
  await page.waitForLoadState("networkidle")
  await expect(page.locator("text=/Proceder|Checkout|Comprar/i").first()).toBeVisible()

  await page.click("a[href*='/checkout']:not([href*='/cart']), button:has-text('Proceder'), button:has-text('Checkout')")
  await page.waitForURL("**/mx/checkout", { timeout: 10_000 })
  await page.waitForLoadState("networkidle")

  await page.fill("#name", "Test User Novapatch")
  await page.fill("#email", process.env.TEST_USER_EMAIL!)
  await page.fill("#phone", "5512345678")

  await page.fill("#street", "Álvaro Obregón 100")
  await page.fill("#zip", "06700")
  await page.waitForResponse((resp) => resp.url().includes("copomex") || resp.url().includes("zip"), { timeout: 8_000 }).catch(() => {})
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
  await page.fill("#cardName", "TEST USER NOVAPATCH")
  await page.fill("#expiry", "12/28")
  await page.fill("#cvv", "123")

  await page.click("button[type='submit']")

  await page.waitForURL((url) => url.pathname.includes("confirm") || url.pathname.includes("gracias") || url.pathname.includes("success"), {
    timeout: 30_000,
  }).catch(async () => {
    await expect(page.locator("text=/¡Gracias|Pedido confirmado|Order confirmed/i").first()).toBeVisible({ timeout: 10_000 })
  })
})
