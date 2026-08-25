import { test, expect } from '@playwright/test'

import { startStack, stopStack, Stack } from '../docker/stack'
import { registerAppProtocol } from '../helpers/appProtocol'
import {
  createOAuth2Client,
  deleteOAuth2Client,
  exchangeCodeForToken,
} from '../helpers/hydra'
import { ensureIdentity } from '../helpers/kratos'
import { createPkcePair, randomString } from '../helpers/pkce'
import { loginWithPassword } from '../helpers/ui'
import { env } from '../env'

test.describe('OAuth2 authorization code + PKCE with app protocol', () => {
  let clientId = ''
  let stack: Stack | null = null

  test.beforeAll(
    async () => {
      stack = await startStack()
      await ensureIdentity()
    },
    { timeout: 600_000 },
  )

  test.afterAll(async () => {
    if (stack) {
      await stopStack(stack)
    }
  })

  test.beforeEach(async () => {
    clientId = `e2e-${randomString(10)}`
    await createOAuth2Client({
      clientId,
      redirectUris: [env.appProtocolCallback],
    })
  })

  test.afterEach(async () => {
    if (clientId) {
      await deleteOAuth2Client(clientId).catch(() => {})
    }
  })

  test('redirects to the app protocol and issues a token via PKCE', async ({
    page,
  }) => {
    const { codeVerifier, codeChallenge } = createPkcePair()
    const state = randomString()

    // "Register" the app protocol: capture the redirect to the custom scheme.
    const appProtocol = await registerAppProtocol(page, env.appProtocol)

    const authorize = new URL('/oauth2/auth', env.hydraPublicUrl)
    authorize.searchParams.set('client_id', clientId)
    authorize.searchParams.set('response_type', 'code')
    authorize.searchParams.set('redirect_uri', env.appProtocolCallback)
    authorize.searchParams.set('scope', env.scope)
    authorize.searchParams.set('state', state)
    authorize.searchParams.set('nonce', randomString())
    authorize.searchParams.set('code_challenge', codeChallenge)
    authorize.searchParams.set('code_challenge_method', 'S256')

    await page.goto(authorize.toString())

    // 1. Kratos login UI
    await expect(page).toHaveURL(/\/auth\/login/)
    await loginWithPassword(page)

    // 2. OAuth2 consent screen
    await expect(page).toHaveURL(/\/auth2\/consent/)
    await expect(
      page.locator('input[name="grant_scope"]').first(),
    ).toBeVisible()
    await page.locator('button[name="action"][value="accept"]').click()

    // 3. The flow ends with a redirect to the app protocol
    const redirectUrl = await appProtocol.waitForRedirect()
    const callback = new URL(redirectUrl)

    expect(callback.protocol).toBe(`${env.appProtocol}:`)
    expect(callback.host).toBe('oauth')
    expect(callback.pathname).toBe('/callback')

    const code = callback.searchParams.get('code')
    expect(code).toBeTruthy()
    expect(callback.searchParams.get('state')).toBe(state)

    // 4. Exchange the authorization code using the PKCE verifier
    const token = await exchangeCodeForToken({
      clientId,
      code: code!,
      redirectUri: env.appProtocolCallback,
      codeVerifier,
    })

    expect(token.token_type).toBe('Bearer')
    expect(token.access_token).toBeTruthy()
    expect(token.scope).toContain('openid')
    expect(token.refresh_token).toBeTruthy()
  })
})
