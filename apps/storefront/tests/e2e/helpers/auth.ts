// novafrontend/apps/storefront/tests/e2e/helpers/auth.ts
import { Page } from "@playwright/test"

export async function loginAsTestUser(page: Page) {
  await page.goto("/mx/sign-in")
  await page.waitForLoadState("networkidle")

  await page.fill("input[name='identifier'], input[type='email']", process.env.TEST_USER_EMAIL!)
  await page.click("button[type='submit']")
  await page.waitForTimeout(500)

  await page.fill("input[type='password']", process.env.TEST_USER_PASSWORD!)
  await page.click("button[type='submit']")

  await page.waitForURL((url) => !url.pathname.includes("sign-in"), { timeout: 15_000 })
}

export async function logout(page: Page) {
  await page.goto("/mx")
  const userButton = page.locator("[data-clerk-component='UserButton'], button[aria-label*='Account'], button[aria-label*='cuenta']")
  await userButton.click()
  await page.click("text=Cerrar sesión, text=Sign out, [data-localization-key='userButton.action__signOut']")
  await page.waitForURL((url) => !url.pathname.includes("dashboard"), { timeout: 10_000 })
}
