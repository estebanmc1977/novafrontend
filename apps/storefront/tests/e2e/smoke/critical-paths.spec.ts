// novafrontend/apps/storefront/tests/e2e/smoke/critical-paths.spec.ts
import { test, expect } from "@playwright/test"

test("homepage loads with at least one product visible", async ({ page }) => {
  await page.goto("/mx")
  await page.waitForLoadState("networkidle")
  const productElements = page.locator("article, [class*='product'], [class*='Product']")
  await expect(productElements.first()).toBeVisible({ timeout: 10_000 })
})

test("/tienda loads with at least one product visible", async ({ page }) => {
  await page.goto("/mx/tienda")
  await page.waitForLoadState("networkidle")
  const productElements = page.locator("article, [class*='product'], [class*='Product']")
  await expect(productElements.first()).toBeVisible({ timeout: 10_000 })
})

test("cart drawer opens", async ({ page }) => {
  await page.goto("/mx")
  await page.waitForLoadState("networkidle")
  const cartButton = page.locator("button[aria-label*='arrito'], button[aria-label*='cart'], button svg").first()
  await cartButton.click()
  await expect(page.locator("[class*='cart'], [class*='Cart'], aside, [role='dialog']").first()).toBeVisible({ timeout: 5_000 })
})

test("Medusa store API responds 200", async ({ request }) => {
  const backendUrl = process.env.BACKEND_URL!
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!
  const response = await request.get(`${backendUrl}/store/products`, {
    headers: { "x-publishable-api-key": publishableKey },
  })
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.products).toBeDefined()
})
