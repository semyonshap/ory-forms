import { test, expect, Page } from '@playwright/test'
import { env } from '../env'
import { ensureIdentity, getCodeForEmail } from '../helpers/kratos'

const password = 'Registration-1234!'

// Step 1: identifier/profile fields (password appears on a separate page)
async function fillRegistrationIdentifier(
  page: Page,
  { email, username }: { email: string; username: string },
) {
  await page.locator('input[name="traits.email"]').fill(email)
  await page.locator('input[name="traits.username"]').fill(username)
  await page
    .locator('input[name="traits.name.first"]')
    .fill('Registration')
  await page.locator('input[name="traits.name.last"]').fill('E2E')

  const submit = page.locator('button[name="method"][value="profile"]')
  await expect(submit).toBeEnabled({ timeout: 30_000 })
  await submit.click()
}

// Step 2: choose the password method on the method-selection page
async function selectPasswordMethod(page: Page) {
  const methodButton = page.locator('button[name="method-password"]')
  const onSelectStep = await methodButton
    .waitFor({ state: 'visible', timeout: 10_000 })
    .then(() => true)
    .catch(() => false)

  if (onSelectStep) {
    await methodButton.click()
    await expect(page.locator('input[name="password"]')).toBeVisible({
      timeout: 30_000,
    })
  }
}

// Step 3: password method (separate page)
async function fillRegistrationPassword(page: Page) {
  const passwordInput = page.locator('input[name="password"]')
  await expect(passwordInput).toBeVisible({ timeout: 30_000 })
  await passwordInput.fill(password)

  const submit = page.locator('button[name="method"][value="password"]')
  await expect(submit).toBeEnabled({ timeout: 30_000 })
  await submit.click()
}

async function completeVerification(page: Page, email: string) {
  await page.waitForURL('**/auth/verification**', { timeout: 30_000 })

  const codeInput = page.locator('input[name="code"]')
  if ((await codeInput.count()) === 0) {
    const emailInput = page.locator('input[name="email"]')
    await expect(emailInput).toBeVisible({ timeout: 15_000 })
    if (!(await emailInput.inputValue())) {
      await emailInput.fill(email)
    }
    await page.locator('button[name="method"][value="code"]').click()
  }

  await expect(codeInput).toBeVisible({ timeout: 30_000 })
  const code = await getCodeForEmail(email)
  await codeInput.fill(code)
  await page.locator('button[name="method"][value="code"]').click()

  await expect(page).toHaveURL(/^http:\/\/localhost:8080\/?$/, {
    timeout: 30_000,
  })
}

test.describe('Registration', () => {
  test('should register a new identity and verify email', async ({
    page,
  }) => {
    const email = `reg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`
    const username = `reg-${Date.now().toString(36)}`

    await page.goto('/auth/registration')
    await fillRegistrationIdentifier(page, { email, username })
    await selectPasswordMethod(page)
    await fillRegistrationPassword(page)
    await completeVerification(page, email)
  })

  test('should reject registration with an existing email', async ({
    page,
  }) => {
    await ensureIdentity()
    await page.goto('/auth/registration')
    await fillRegistrationIdentifier(page, {
      email: env.identity.email,
      username: `dup-${Date.now().toString(36)}`,
    })

    await selectPasswordMethod(page)

    const passwordInput = page.locator('input[name="password"]')
    const hasPassword = await passwordInput
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false)
    if (hasPassword) {
      await fillRegistrationPassword(page)
    }

    const error = page
      .locator('[role="alert"], .text-destructive')
      .filter({
        hasText:
          /exists already|already exists|already in use|in use|taken/i,
      })
    await expect(error.first()).toBeVisible({ timeout: 30_000 })
  })
})
