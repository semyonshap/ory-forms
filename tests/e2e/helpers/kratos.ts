import { Configuration, IdentityApi, CourierApi } from '@ory/client-fetch'
import { env } from '../env'

const config = new Configuration({
  basePath: env.kratosAdminUrl,
})

const identityApi = new IdentityApi(config)
const courierApi = new CourierApi(config)

/**
 * Ensures the e2e identity exists in Kratos (idempotent) and logs in via the
 * password method. Uses a dedicated identity so the test does not depend on the
 * `init` container having run.
 */
export async function ensureIdentity() {
  const existing = await findIdentityByEmail(env.identity.email)
  if (existing) return existing

  return identityApi.createIdentity({
    createIdentityBody: {
      schema_id: 'default',
      traits: {
        username: env.identity.username,
        email: env.identity.email,
        name: {
          first: env.identity.firstName,
          last: env.identity.lastName,
        },
      },
      credentials: {
        password: { config: { password: env.identity.password } },
      },
    },
  })
}

async function findIdentityByEmail(email: string) {
  try {
    const identities = await identityApi.listIdentities({
      credentialsIdentifier: email,
    })
    return identities[0] ?? null
  } catch {
    return null
  }
}

/**
 * Fetches the latest login code delivered via email from the Kratos courier
 * admin API (used to complete the second factor / code method).
 * Polls until a message with a code appears.
 */
export async function getLoginCode(timeoutMs = 20_000): Promise<string> {
  const deadline = Date.now() + timeoutMs
  let lastError: unknown

  while (Date.now() < deadline) {
    try {
      const messages = await courierApi.listCourierMessages({
        pageSize: 50,
      })

      const message = messages
        .filter(
          (m) =>
            m.recipient === env.identity.email &&
            /code/i.test(m.body ?? ''),
        )
        .sort((a, b) =>
          (b.created_at?.toISOString() ?? '').localeCompare(
            a.created_at?.toISOString() ?? '',
          ),
        )[0]

      if (message) {
        const match = message.body?.match(/(\d{6,8})/)
        if (match) return match[1]
      }
    } catch (err) {
      lastError = err
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  throw new Error(
    `Timed out waiting for a login code from courier (last error: ${String(lastError)})`,
  )
}
