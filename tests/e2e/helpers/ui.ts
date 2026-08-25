import { expect, Page } from '@playwright/test'
import { env } from '../env'
import { getLoginCode } from './kratos'

/**
 * Fills the Kratos login form (password method) and submits it, then completes
 * the second factor (code method) — the code is delivered via email and read
 * from the Kratos courier admin API.
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

  // Second factor: Kratos code method (code delivered via email)
  const codeInput = page.locator('input[name="code"]')
  const needsCode = await codeInput
    .waitFor({ state: 'visible', timeout: 20_000 })
    .then(() => true)
    .catch(() => false)

  if (needsCode) {
    const code = await getLoginCode()
    await codeInput.fill(code)
    await page.locator('button[name="method"][value="code"]').click()
  }
}
