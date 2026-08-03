import { Configuration, FrontendApi, OAuth2Api } from '@ory/client-fetch'

import { oryHydraUrl, orySdkUrl } from '../utils/sdk'

export const serverSideFrontendClient = () =>
  new FrontendApi(
    new Configuration({
      headers: { Accept: 'application/json' },
      basePath: orySdkUrl(),
    }),
  )

export const serverSideOAuth2Client = () =>
  new OAuth2Api(
    new Configuration({
      headers: { Accept: 'application/json' },
      basePath: oryHydraUrl(),
    }),
  )
