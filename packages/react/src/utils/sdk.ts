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

function getEnv(name: string): string | undefined {
  return process.env[`NEXT_PUBLIC_${name}`] || process.env[name]
}

export function isProduction() {
  const env = getEnv('VERCEL_ENV') || getEnv('NODE_ENV') || ''
  return ['production', 'prod'].indexOf(env) > -1
}
