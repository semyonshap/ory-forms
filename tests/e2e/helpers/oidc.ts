import * as client from 'openid-client'
import { env } from '../env'

export interface ExchangeCodeOptions {
  clientId: string
  code: string
  redirectUri: string
  codeVerifier: string
  nonce?: string
}

export async function exchangeCodeForToken({
  clientId,
  code,
  redirectUri,
  codeVerifier,
  nonce,
}: ExchangeCodeOptions) {
  const config = await client.discovery(
    new URL(`${env.hydraPublicUrl}/.well-known/openid-configuration`),
    clientId,
    { token_endpoint_auth_method: 'none' },
    client.None(),
    {
      execute: [client.allowInsecureRequests],
    },
  )

  const currentUrl = new URL(redirectUri)
  currentUrl.searchParams.set('code', code)

  const tokenSet = await client.authorizationCodeGrant(
    config,
    currentUrl,
    {
      pkceCodeVerifier: codeVerifier,
      idTokenExpected: true,
      expectedNonce: nonce,
    },
  )

  return {
    access_token: tokenSet.access_token!,
    token_type: tokenSet.token_type!,
    expires_in: tokenSet.expires_in ?? 0,
    scope: tokenSet.scope ?? '',
    id_token: tokenSet.id_token,
    refresh_token: tokenSet.refresh_token,
  }
}

import { decodeJwt, decodeProtectedHeader } from 'jose'

export function printTokenInfo(token: client.TokenEndpointResponse): void {
  const result: any = {
    raw: token,
    decoded: {},
  }

  if (token.access_token && token.access_token.split('.').length === 3) {
    try {
      result.decoded.access = {
        payload: decodeJwt(token.access_token),
        header: decodeProtectedHeader(token.access_token),
      }
    } catch {
      result.decoded.access = 'Failed to decode'
    }
  }

  if (token.id_token) {
    try {
      result.decoded.id = decodeJwt(token.id_token)
    } catch {
      result.decoded.id = 'Failed to decode'
    }
  }

  console.log(JSON.stringify(result, null, 2))
}
