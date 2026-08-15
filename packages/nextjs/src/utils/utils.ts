import { pick } from 'lodash-es'

import { NextRequest } from 'next/server'
import { defaultForwardedHeaders } from '../const'
import { OryMiddlewareCustomRoute } from '../types'

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

export function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  return trimmed.replace(/\/$/, '')
}

export function getProjectApiKey() {
  let baseUrl = ''

  if (process.env['ORY_PROJECT_API_TOKEN']) {
    baseUrl = process.env['ORY_PROJECT_API_TOKEN']
  }

  return baseUrl.replace(/\/$/, '')
}

export function isRouteAuthorized(
  request: NextRequest,
  auth: OryMiddlewareCustomRoute['auth'],
): boolean {
  if (!auth) return true

  const value =
    auth.type === 'cookie'
      ? auth.key
        ? request.cookies.get(auth.key)?.value
        : null
      : auth.key
        ? request.headers.get(auth.key)
        : null

  return Boolean(auth.secret) && value === auth.secret
}
