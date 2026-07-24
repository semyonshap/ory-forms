import { parse } from 'tldts'
import parseSetCookie from 'set-cookie-parser'
import { serialize, type SerializeOptions } from 'cookie'

import { OryMiddlewareOptions } from './middleware'

export function rewriteSetCookieHeaders(
  request: { nextUrl: { protocol: string }; headers: Headers },
  upstreamResponse: Response,
  options: OryMiddlewareOptions,
) {
  const setCookieHeader = upstreamResponse.headers.get('set-cookie')
  if (!setCookieHeader) return

  const cookies = parseSetCookie(setCookieHeader)
  const cookieOptions = resolveCookieOptions(request, options)

  upstreamResponse.headers.delete('set-cookie')
  for (const { name, value, ...opts } of cookies) {
    const serialized = serialize(name, value, {
      ...(opts as SerializeOptions),
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

  const secure = nextUrl.protocol === 'https:' || headers.get('x-forwarded-proto') === 'https'

  const host = headers.get('x-forwarded-host') ?? headers.get('host')
  const domain = options.forceCookieDomain ?? (host ? guessCookieDomain(host) : undefined)

  return { secure, domain }
}

function guessCookieDomain(host: string): string | undefined {
  const hostname = host.replace(/:\d+$/, '')
  const result = parse(hostname)

  return result.isIp ? hostname : (result.domain ?? undefined)
}
