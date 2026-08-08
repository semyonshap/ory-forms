import { parse } from 'tldts'
import { parseSetCookie, serialize, splitSetCookieString } from 'cookie-es'

import { OryMiddlewareOptions } from '../types'

export function rewriteSetCookieHeaders(
  request: { nextUrl: { protocol: string }; headers: Headers },
  upstreamResponse: Response,
  options: OryMiddlewareOptions,
) {
  const setCookieHeader = upstreamResponse.headers.get('set-cookie')
  if (!setCookieHeader) return

  const cookieOptions = resolveCookieOptions(request, options)

  upstreamResponse.headers.delete('set-cookie')
  for (const str of splitSetCookieString(setCookieHeader)) {
    const parsed = parseSetCookie(str)
    if (!parsed) continue
    const { name, value, ...opts } = parsed
    const serialized = serialize(name, value, {
      ...opts,
      ...cookieOptions,
      encode: (v) => v,
    })
    upstreamResponse.headers.append('Set-Cookie', serialized)
  }
}

function resolveCookieOptions(
  request: { nextUrl: { protocol: string }; headers: Headers },
  options: OryMiddlewareOptions,
) {
  const { headers, nextUrl } = request

  const secure =
    nextUrl.protocol === 'https:' ||
    headers.get('x-forwarded-proto') === 'https'

  const host = headers.get('x-forwarded-host') ?? headers.get('host')
  const domain =
    options.forceCookieDomain ??
    (host ? guessCookieDomain(host) : undefined)

  return { secure, domain }
}

function guessCookieDomain(host: string): string | undefined {
  const hostname = host.replace(/:\d+$/, '')
  const result = parse(hostname)

  return result.isIp ? hostname : (result.domain ?? undefined)
}
