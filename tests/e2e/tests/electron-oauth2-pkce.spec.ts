import {
  test,
  _electron as electron,
  ElectronApplication,
  Page,
  expect,
} from '@playwright/test'
import * as client from 'openid-client'
import * as jose from 'jose'
import path from 'path'
import { createOAuth2Client } from '../helpers/hydra'
import { ensureIdentity } from '../helpers/kratos'
import { env } from '../env'
import { exchangeCodeForToken, printTokenInfo } from '../helpers/oidc'

test.describe('OAuth2 with Electron app', () => {
  let clientId = ''
  let electronApp: ElectronApplication
  let mainWindow: Page

  test.beforeAll(async () => {
    await ensureIdentity()
    electronApp = await electron.launch({
      executablePath: require('electron'),
      args: [path.join(__dirname, '..', 'electron', 'main.js')],
    })
    mainWindow = await electronApp.firstWindow()
    await mainWindow.waitForLoadState()
  })

  test.beforeEach(async () => {
    clientId = `e2e-${client.randomState().slice(0, 10)}`
    await createOAuth2Client({
      clientId,
      redirectUris: [env.appProtocolCallback],
      accessTokenStrategy: 'jwt',
    })
  })

  test('should complete OAuth2 flow with deep link redirect', async () => {
    const codeVerifier = client.randomPKCECodeVerifier()
    const codeChallenge =
      await client.calculatePKCECodeChallenge(codeVerifier)
    const state = client.randomState()
    const nonce = client.randomNonce()

    await mainWindow.evaluate(
      (params) => {
        ;(window as any).__authParams = params
      },
      {
        clientId,
        redirectUri: env.appProtocolCallback,
        scope: env.scope,
        codeChallenge,
        state,
        nonce,
      },
    )

    await mainWindow.waitForFunction(
      () => (window as any).__oauthCode !== null,
      { timeout: 120_000 },
    )

    const code = await mainWindow.evaluate(
      () => (window as any).__oauthCode,
    )
    expect(code).toBeTruthy()

    const statusText = await mainWindow.locator('#status').textContent()
    expect(statusText).toContain('✅ Код:')

    const token = await exchangeCodeForToken({
      clientId,
      code,
      redirectUri: env.appProtocolCallback,
      codeVerifier,
      nonce,
    })

    expect(token.access_token).toBeTruthy()
    expect(token.refresh_token).toBeTruthy()
    expect(token.token_type).toBe('bearer')
    expect(token.scope).toContain('openid')

    console.log(
      JSON.stringify(
        {
          access: token.access_token,
          refresh: token.refresh_token,
          id: token.id_token,
          scope: token.scope,
          type: token.token_type,
          expires: token.expires_in,
        },
        null,
        2,
      ),
    )

    printTokenInfo(token)
  })
})
