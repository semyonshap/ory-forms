import { test, expect } from '@playwright/test'
import { env } from '../env'
import { ensureIdentity } from '../helpers/kratos'

const verifyUrl = `${env.authUrl}/custom-service/verify`

test.describe('Captcha verification', () => {
  test.beforeAll(async () => {
    await ensureIdentity()
  })

  test('returns 400 "Missing captcha token" for empty body', async ({
    request,
  }) => {
    const res = await request.post(verifyUrl, {
      headers: { [env.webhook.key]: env.webhook.secret },
      data: {},
    })
    expect(res.status()).toBe(400)
    expect(JSON.stringify(await res.json())).toContain(
      'Missing captcha token',
    )
  })

  test('returns 400 "Missing captcha token" for empty token', async ({
    request,
  }) => {
    const res = await request.post(verifyUrl, {
      headers: { [env.webhook.key]: env.webhook.secret },
      data: { captcha_token: '' },
    })
    expect(res.status()).toBe(400)
    expect(JSON.stringify(await res.json())).toContain(
      'Missing captcha token',
    )
  })

  test('shows "Missing captcha token" error in the login UI', async ({
    page,
  }) => {
    // 1. Create a login flow in the browser
    await page.goto('/auth/login')
    await page.waitForURL(/flow=/)
    const flowId = new URL(page.url()).searchParams.get('flow')!

    // 2. Fetch the flow to read the CSRF token
    const flowRes = await page.request.get(
      `${env.authUrl}/self-service/login/flows?id=${flowId}`,
    )
    const flow = await flowRes.json()
    const csrf = flow.ui?.nodes?.find(
      (n: any) => n.attributes?.name === 'csrf_token',
    )?.attributes?.value

    // 3. Submit the flow with valid credentials but an EMPTY captcha token,
    //    so the Kratos webhook interrupts with "Missing captcha token"
    const res = await page.request.post(
      `${env.authUrl}/self-service/login?flow=${flowId}`,
      {
        headers: { Accept: 'application/json' },
        form: {
          csrf_token: csrf ?? '',
          identifier: env.identity.username,
          password: env.identity.password,
          method: 'password',
          captcha_turnstile_response: '',
        },
      },
    )

    // 4. The webhook error must be present in the flow UI messages
    const updated = await res.json()
    expect(JSON.stringify(updated.ui?.messages ?? [])).toContain(
      'Missing captcha token',
    )

    // 5. Render the updated flow in the browser and assert the error is visible
    await page.goto(`/auth/login?flow=${flowId}`)
    await expect(page.getByText('Missing captcha token')).toBeVisible()
  })
})
