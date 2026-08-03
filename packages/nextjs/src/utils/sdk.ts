import { getDomain } from 'tldts'

function getEnv(name: string): string | undefined {
  return process.env[`NEXT_PUBLIC_${name}`] || process.env[name]
}

function orySdkUrlOrNull(): string | null {
  const baseUrl = getEnv('ORY_SDK_URL')
  return baseUrl ? baseUrl.replace(/\/$/, '') : null
}

export function orySdkUrl() {
  const baseUrl = orySdkUrlOrNull()

  if (!baseUrl) {
    throw new Error(
      'You need to set environment variable `NEXT_PUBLIC_ORY_SDK_URL` to your Ory Network SDK URL.',
    )
  }

  return baseUrl
}

function oryOAuth2UrlOrNull(): string | null {
  const baseUrl = getEnv('ORY_OAUTH2_URL')
  return baseUrl ? baseUrl.replace(/\/$/, '') : null
}

export function oryOAuth2Url() {
  const baseUrl = oryOAuth2UrlOrNull()

  if (!baseUrl) {
    throw new Error('You need to set environment variable `ORY_OAUTH2_URL` to your Hydra URL.')
  }

  return baseUrl
}

function isProduction() {
  const env = getEnv('VERCEL_ENV') || getEnv('NODE_ENV') || ''
  return ['production', 'prod'].indexOf(env) > -1
}

function isSameSite(originA: string, originB: string): boolean {
  let hostA: string, hostB: string
  try {
    hostA = new URL(originA).hostname
    hostB = new URL(originB).hostname
  } catch {
    return false
  }

  if (hostA === hostB) return true

  const domainA = getDomain(hostA)
  const domainB = getDomain(hostB)
  return Boolean(domainA && domainB && domainA === domainB)
}

export function guessPotentiallyProxiedOrySdkUrl(options?: { knownProxiedUrl?: string }) {
  const visitedOrigin =
    options?.knownProxiedUrl ?? (typeof window !== 'undefined' ? window.location.origin : undefined)

  const sdkUrl = orySdkUrlOrNull()

  if (visitedOrigin && sdkUrl && isSameSite(visitedOrigin, sdkUrl)) {
    return sdkUrl
  }

  if (isProduction()) {
    if (getEnv('VERCEL_ENV')) {
      const productionUrl = getEnv('VERCEL_PROJECT_PRODUCTION_URL') || ''
      if (productionUrl.indexOf('vercel.app') > -1) {
        return `https://${productionUrl}`.replace(/\/$/, '')
      }
    }

    return orySdkUrl()
  }

  if (visitedOrigin) {
    return visitedOrigin.replace(/\/$/, '')
  }

  if (getEnv('VERCEL_ENV')) {
    if (getEnv('VERCEL_URL')) {
      return `https://${getEnv('VERCEL_URL')}`.replace(/\/$/, '')
    }

    if (process.env['__NEXT_PRIVATE_ORIGIN']) {
      return process.env['__NEXT_PRIVATE_ORIGIN'].replace(/\/$/, '')
    }
  }

  const final = orySdkUrl()
  console.warn(
    `Unable to determine a suitable SDK URL for setting up the Next.js integration of Ory Elements. Will proceed using default Ory SDK URL "${final}". This is likely not what you want for local development and your authentication and login may not work.`,
  )

  return final
}
