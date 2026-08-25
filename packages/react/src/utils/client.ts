import { Configuration, ConfigurationParameters } from '@ory/client-fetch'

import { OryFrontendApi } from './sdk'

export function frontendClient(
  sdkUrl: string,
  opts: Partial<ConfigurationParameters> = {},
) {
  const config = new Configuration({
    ...opts,
    basePath: sdkUrl.replace(/\/$/, ''),
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  return new OryFrontendApi(config)
}
