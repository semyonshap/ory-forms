import { Configuration, OAuth2Api } from '@ory/client-fetch'
import { env } from '../env'

const oauth2Api = new OAuth2Api(
  new Configuration({
    basePath: env.hydraAdminUrl,
  }),
)

export async function createOAuth2Client({
  clientId,
  redirectUris,
  scopes = env.scope,
  accessTokenStrategy = 'opaque',
}: {
  clientId: string
  redirectUris: string[]
  scopes?: string
  accessTokenStrategy?: 'jwt' | 'opaque'
}) {
  return oauth2Api.createOAuth2Client({
    oAuth2Client: {
      client_id: clientId,
      client_name: `E2E ${clientId}`,
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      scope: scopes,
      redirect_uris: redirectUris,
      token_endpoint_auth_method: 'none',
      access_token_strategy: accessTokenStrategy,
    },
  })
}
