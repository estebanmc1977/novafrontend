// novafrontend/apps/storefront/tests/e2e/auth/login.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Clerk auth flows", () => {
  test("login with existing account", async ({ page }) => {
    await page.goto("/mx/sign-in")
    await page.waitForLoadState("networkidle")

    await page.fill("input[name='identifier'], input[type='email']", process.env.TEST_USER_EMAIL!)
    await page.click("button[type='submit']")
    await page.waitForTimeout(500)

    await page.fill("input[type='password']", process.env.TEST_USER_PASSWORD!)
    await page.click("button[type='submit']")

    await page.waitForURL((url) => !url.pathname.includes("sign-in"), { timeout: 15_000 })
    await expect(page.locator("[data-clerk-component='UserButton'], button[aria-label*='Account']").first()).toBeVisible()
  })

  test("password recovery sends email", async ({ page }) => {
    await page.goto("/mx/sign-in")
    await page.waitForLoadState("networkidle")

    const forgotLink = page.locator("a:has-text('olvidaste'), a:has-text('Forgot'), a[data-localization-key*='forgot']")
    await forgotLink.click()

    await page.fill("input[type='email']", process.env.TEST_USER_EMAIL!)
    await page.click("button[type='submit']")

    await expect(page.locator("text=correo, text=email, text=code").first()).toBeVisible({ timeout: 10_000 })
  })
})
