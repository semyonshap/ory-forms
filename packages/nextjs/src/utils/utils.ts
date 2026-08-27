import { pick } from 'lodash-es'

import { NextRequest, NextResponse } from 'next/server'
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

  const { type, key, secret } = auth

  if (!key || !secret) {
    console.warn('Auth is missing key or secret')
    return false
  }

  let value: string | null = null

  switch (type) {
    case 'cookie':
      value = request.cookies.get(key)?.value ?? null
      break
    case 'header':
      value = request.headers.get(key)
      break
    default:
      console.warn(`Unknown auth type: "${type}"`)
      return false
  }

  return value === secret
}

export function buildJsonResponse(
  status: number,
  message: string,
): NextResponse {
  if (status >= 200 && status < 400) {
    return new NextResponse(null, { status })
  }

  return NextResponse.json(
    {
      messages: [
        {
          instance_ptr: '#/',
          messages: [
            {
              id: status === 400 ? 4000038 : 500,
              text: message,
              type: 'error',
              context: {},
            },
          ],
        },
      ],
    },
    { status },
  )
}
