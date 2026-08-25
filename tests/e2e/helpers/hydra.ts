import { env } from '../env'

export interface CreateOAuth2ClientOptions {
  clientId: string
  redirectUris: string[]
  scopes?: string
}

/**
 * Creates a public OAuth2 client (PKCE, no client secret) via the Hydra admin API.
 * The redirect_uri points to the app protocol (custom URL scheme).
 */
export async function createOAuth2Client({
  clientId,
  redirectUris,
  scopes = env.scope,
}: CreateOAuth2ClientOptions) {
  const response = await fetch(`${env.hydraAdminUrl}/admin/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_name: `E2E ${clientId}`,
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      scope: scopes,
      redirect_uris: redirectUris,
      token_endpoint_auth_method: 'none',
      require_pkce: true,
    }),
  })

  if (!response.ok) {
    throw new Error(
      `Failed to create OAuth2 client "${clientId}": ${response.status} ${await response.text()}`,
    )
  }

  return response.json()
}

export async function deleteOAuth2Client(clientId: string) {
  const response = await fetch(
    `${env.hydraAdminUrl}/admin/clients/${clientId}`,
    { method: 'DELETE' },
  )

  if (!response.ok && response.status !== 404) {
    throw new Error(
      `Failed to delete OAuth2 client "${clientId}": ${response.status}`,
    )
  }
}

export interface ExchangeCodeOptions {
  clientId: string
  code: string
  redirectUri: string
  codeVerifier: string
}

export async function exchangeCodeForToken({
  clientId,
  code,
  redirectUri,
  codeVerifier,
}: ExchangeCodeOptions) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  })

  const response = await fetch(`${env.hydraPublicUrl}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const json = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(
      `Token exchange failed: ${response.status} ${JSON.stringify(json)}`,
    )
  }
  return json as {
    access_token: string
    token_type: string
    expires_in: number
    scope: string
    id_token?: string
    refresh_token?: string
  }
}
