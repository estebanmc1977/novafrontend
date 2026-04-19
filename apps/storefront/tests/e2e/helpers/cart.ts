// novafrontend/apps/storefront/tests/e2e/helpers/cart.ts
import { Page } from "@playwright/test"

export async function addFirstProductToCart(page: Page) {
  await page.goto("/mx/tienda")
  await page.waitForLoadState("networkidle")

  const addButton = page.locator("button:has-text('Agregar'), button:has-text('Añadir')").first()
  await addButton.click()

  await page.waitForTimeout(1000)
}
