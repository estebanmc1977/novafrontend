// novafrontend/apps/storefront/tests/e2e/auth/cart-persistence.spec.ts
import { test, expect } from "@playwright/test"
import { loginAsTestUser, logout } from "../helpers/auth"
import { addFirstProductToCart } from "../helpers/cart"

test("cart persists after logout and login (localStorage survives same browser session)", async ({ page }) => {
  await loginAsTestUser(page)
  await addFirstProductToCart(page)

  const cartBefore = await page.evaluate(() => localStorage.getItem("novapatch_cart"))
  expect(cartBefore).not.toBeNull()
  const itemsBefore = JSON.parse(cartBefore!)
  expect(itemsBefore.length).toBeGreaterThan(0)

  await logout(page)

  const cartAfterLogout = await page.evaluate(() => localStorage.getItem("novapatch_cart"))
  expect(cartAfterLogout).not.toBeNull()

  await loginAsTestUser(page)

  const cartAfterLogin = await page.evaluate(() => localStorage.getItem("novapatch_cart"))
  const itemsAfterLogin = JSON.parse(cartAfterLogin!)
  expect(itemsAfterLogin.length).toBe(itemsBefore.length)
})
