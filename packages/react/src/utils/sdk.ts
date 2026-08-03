import {
  Configuration,
  ConfigurationParameters,
  FrontendApi,
} from '@ory/client-fetch'

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

  return new FrontendApi(config)
}
