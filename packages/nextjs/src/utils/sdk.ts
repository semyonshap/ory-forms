import { normalizeUrl } from './utils'

function getEnv(names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]
    if (value !== undefined) {
      return value
    }
  }
  return undefined
}
function getUrl(names: string[]): string {
  const baseUrl = getEnv(names)
  if (!baseUrl) {
    throw new Error(
      `You need to set one of environment variables: ${names.join(', ')}.`,
    )
  }
  return normalizeUrl(baseUrl)
}

export function orySdkUrl() {
  return getUrl(['ORY_SDK_URL', 'NEXT_PUBLIC_ORY_SDK_URL'])
}

export function orySdkPublicUrl() {
  return getUrl(['NEXT_PUBLIC_ORY_SDK_URL'])
}

export function oryHydraUrl() {
  return getUrl(['ORY_HYDRA_URL'])
}
