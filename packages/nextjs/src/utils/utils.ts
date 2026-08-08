import { pick } from 'lodash-es'

import { defaultForwardedHeaders } from '../const'
import { headers } from 'next/headers'

export function onValidationError<T>(value: T): T {
  return value
}

export function filterRequestHeaders(
  headers: Headers,
  forwardAdditionalHeaders?: string[],
): Headers {
  const allowedKeys = [
    ...defaultForwardedHeaders,
    ...(forwardAdditionalHeaders ?? []),
  ]
  const headersObj = Object.fromEntries(headers.entries())
  const filtered = pick(headersObj, allowedKeys)
  return new Headers(filtered)
}

export function joinUrlPaths(
  baseUrl: string,
  relativeUrl: string,
): string {
  const base = new URL(baseUrl)
  const relative = new URL(relativeUrl, baseUrl)

  relative.pathname =
    base.pathname.replace(/\/$/, '') +
    '/' +
    relative.pathname.replace(/^\//, '')

  return new URL(relative.toString(), baseUrl).href
}

export async function getRequestOrigin() {
  const h = await headers()
  const host = h.get('host')
  if (!host) {
    return undefined
  }
  const protocol = h.get('x-forwarded-proto') || 'http'
  return `${protocol}://${host}`
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  return trimmed.replace(/\/$/, '')
}
