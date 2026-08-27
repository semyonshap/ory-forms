import { test, expect } from '@playwright/test'
import * as client from 'openid-client'
import { createServer, Server } from 'http'
import { AddressInfo } from 'net'
import { URL } from 'url'
import { createOAuth2Client } from '../helpers/hydra'
import { ensureIdentity } from '../helpers/kratos'
import { loginWithPassword } from '../helpers/ui'
import { env } from '../env'
import { exchangeCodeForToken, printTokenInfo } from '../helpers/oidc'
import { openExternalBrowser } from '../helpers/system'

test.describe('OAuth2 flow', () => {
  let clientId: string
  let server: Server
  let port: number
  let receivedCode: string | null = null

  test.beforeAll(async () => {
    await ensureIdentity()
  })

  test.beforeEach(async () => {
    receivedCode = null
    server = createServer((req, res) => {
      const url = new URL(req.url!, `http://localhost:${port}`)
      if (url.pathname === '/callback') {
        const code = url.searchParams.get('code')
        if (code) {
          receivedCode = code
          res.writeHead(200, { 'Content-Type': 'text/plain' })
          res.end('OK')
        } else {
          res.writeHead(400)
          res.end('Missing code')
        }
      } else {
        res.writeHead(404)
        res.end('Not found')
      }
    })

    await new Promise<void>((resolve) => {
      server.listen(0, 'localhost', () => {
        const addr = server.address() as AddressInfo
        port = addr.port
        resolve()
      })
    })

    clientId = `e2e-${client.randomState().slice(0, 10)}`
    await createOAuth2Client({
      clientId,
      redirectUris: [`http://localhost:${port}/callback`],
      postLogoutRedirectUris: [`http://localhost:${port}`],
    })
  })

  test.afterEach(async () => {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err?: Error) => {
          if (err) reject(err)
          else resolve()
        })
      })
    }
  })

  test('should complete OAuth2 flow via browser', async ({ page }) => {
    const codeVerifier = client.randomPKCECodeVerifier()
    const codeChallenge =
      await client.calculatePKCECodeChallenge(codeVerifier)
    const state = client.randomState()
    const nonce = client.randomNonce()

    const authorizeUrl = new URL('/oauth2/auth', env.hydraPublicUrl)
    authorizeUrl.searchParams.set('client_id', clientId)
    authorizeUrl.searchParams.set('response_type', 'code')
    authorizeUrl.searchParams.set(
      'redirect_uri',
      `http://localhost:${port}/callback`,
    )
    authorizeUrl.searchParams.set('scope', env.scope)
    authorizeUrl.searchParams.set('state', state)
    authorizeUrl.searchParams.set('nonce', nonce)
    authorizeUrl.searchParams.set('code_challenge', codeChallenge)
    authorizeUrl.searchParams.set('code_challenge_method', 'S256')

    await page.goto(authorizeUrl.toString())
    await loginWithPassword(page)

    const consentForm = page.locator('form[action*="consent"]')
    await consentForm
      .waitFor({ state: 'visible', timeout: 30_000 })
      .catch(() => {})
    if ((await consentForm.count()) > 0) {
      await consentForm.locator('button[value="accept"]').click()
    }

    await test.step('Wait for code', async () => {
      await expect(async () => {
        expect(receivedCode).toBeTruthy()
      }).toPass({ timeout: 30_000 })
    })

    const token = await exchangeCodeForToken({
      clientId,
      code: receivedCode!,
      redirectUri: `http://localhost:${port}/callback`,
      codeVerifier,
      nonce,
    })

    expect(token.access_token).toBeTruthy()
    expect(token.refresh_token).toBeTruthy()
    expect(token.token_type).toBe('bearer')
    expect(token.scope).toContain('openid')

    printTokenInfo(token)

    await test.step('Perform RP-initiated logout', async () => {
      const postLogoutRedirectUri = `http://localhost:${port}`
      const logoutState = client.randomState()

      const logoutUrl = new URL(
        '/oauth2/sessions/logout',
        env.hydraPublicUrl,
      )
      if (token.id_token) {
        logoutUrl.searchParams.set('id_token_hint', token.id_token)
      }
      logoutUrl.searchParams.set(
        'post_logout_redirect_uri',
        postLogoutRedirectUri,
      )
      logoutUrl.searchParams.set('state', logoutState)

      await page.goto(logoutUrl.toString())

      const logoutConfirmButton = page.locator(
        'button[id="accept"], button[value="accept"]',
      )
      if ((await logoutConfirmButton.count()) > 0) {
        await logoutConfirmButton.click()
      }

      await page.waitForURL(
        (url) =>
          url.origin === new URL(postLogoutRedirectUri).origin &&
          url.searchParams.get('state') === logoutState,
      )
    })
  })

  test('manual complete OAuth2 flow via external browser', async ({}) => {
    test.setTimeout(180_000)

    const codeVerifier = client.randomPKCECodeVerifier()
    const codeChallenge =
      await client.calculatePKCECodeChallenge(codeVerifier)
    const state = client.randomState()
    const nonce = client.randomNonce()

    const authorizeUrl = new URL('/oauth2/auth', env.hydraPublicUrl)
    authorizeUrl.searchParams.set('client_id', clientId)
    authorizeUrl.searchParams.set('response_type', 'code')
    authorizeUrl.searchParams.set(
      'redirect_uri',
      `http://localhost:${port}/callback`,
    )
    authorizeUrl.searchParams.set('scope', env.scope)
    authorizeUrl.searchParams.set('state', state)
    authorizeUrl.searchParams.set('nonce', nonce)
    authorizeUrl.searchParams.set('code_challenge', codeChallenge)
    authorizeUrl.searchParams.set('code_challenge_method', 'S256')

    openExternalBrowser(authorizeUrl.toString())

    await test.step('Wait for code (manual)', async () => {
      await expect(async () => {
        expect(receivedCode).toBeTruthy()
      }).toPass({ timeout: 150_000 })
    })

    console.log('Code received:', receivedCode)

    const token = await exchangeCodeForToken({
      clientId,
      code: receivedCode!,
      redirectUri: `http://localhost:${port}/callback`,
      codeVerifier,
      nonce,
    })

    expect(token.access_token).toBeTruthy()
    expect(token.refresh_token).toBeTruthy()
    expect(token.token_type).toBe('bearer')
    expect(token.scope).toContain('openid')

    printTokenInfo(token)
  })
})
