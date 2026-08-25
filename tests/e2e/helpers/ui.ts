import { expect, Page } from '@playwright/test'
import { env } from '../env'

/**
 * Fills the Kratos login form (password method) and submits it.
 * The submit button stays disabled until the Turnstile captcha (dev key,
 * "always passes") resolves and produces a token, so we wait for it to enable
 * before clicking — this makes the login deterministic.
 */
export async function loginWithPassword(page: Page) {
  await page
    .locator('input[name="identifier"]')
    .fill(env.identity.username)
  await page.locator('input[name="password"]').fill(env.identity.password)

  const submit = page.locator('button[name="method"][value="password"]')

  await expect(submit).toBeEnabled({ timeout: 30_000 })
  await submit.click()
}
