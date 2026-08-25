import { env } from '../env'

/**
 * Ensures the e2e identity exists in Kratos (idempotent) and logs in via the
 * password method. Uses a dedicated identity so the test does not depend on the
 * `init` container having run.
 */
export async function ensureIdentity() {
  const existing = await findIdentityByEmail(env.identity.email)
  if (existing) return existing

  const response = await fetch(`${env.kratosAdminUrl}/admin/identities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
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
    }),
  })

  if (!response.ok) {
    throw new Error(
      `Failed to create e2e identity: ${response.status} ${await response.text()}`,
    )
  }

  return response.json()
}

async function findIdentityByEmail(email: string) {
  const response = await fetch(
    `${env.kratosAdminUrl}/admin/identities?credentials_identifier=${encodeURIComponent(email)}`,
  )
  if (!response.ok) return null
  const identities = (await response.json()) as unknown[]
  return identities[0] ?? null
}
