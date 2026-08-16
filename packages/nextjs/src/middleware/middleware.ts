import { some } from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'

import { orySdkUrl } from '../utils/sdk'
import { buildUpstreamResponse } from './response'
import { rewriteSetCookieHeaders } from './cookie'
import { handleConsentSubmit } from '../handlers/consent'
import { handleLogoutSubmit } from '../handlers/logout'
import { buildUpstreamUrl, buildUpstreamHeaders } from './request'
import { OryMiddlewareCustomRoute, OryMiddlewareOptions } from '../types'
import { buildJsonResponse, isRouteAuthorized } from '../utils/utils'

const extraRoutes: OryMiddlewareCustomRoute[] = [
  {
    path: '/custom-service/consent',
    method: 'POST',
    handler: handleConsentSubmit,
  },
  {
    path: '/custom-service/logout',
    method: 'POST',
    handler: handleLogoutSubmit,
  },
]

async function proxyRequest(
  request: NextRequest,
  options: OryMiddlewareOptions,
) {
  const customRoutes = [...(options.customRoutes ?? []), ...extraRoutes]

  const matchedCustom = customRoutes.find(
    (route) =>
      request.nextUrl.pathname === route.path &&
      (!route.method || request.method === route.method),
  )

  if (matchedCustom) {
    if (!isRouteAuthorized(request, matchedCustom.auth)) {
      return buildJsonResponse(
        401,
        'Server configuration error. Please contact support.',
      )
    }
    return matchedCustom.handler(request)
  }

  const matchPaths = [
    '/self-service',
    '/sessions/whoami',
    '/ui',
    '/.well-known/ory',
    '/.ory',
  ]

  if (
    !some(matchPaths, (path) => request.nextUrl.pathname.startsWith(path))
  ) {
    return NextResponse.next()
  }

  const appBaseHost = request.headers.get('host')
  const matchBaseUrl = new URL(orySdkUrl())
  const selfUrl =
    request.nextUrl.protocol + '//' + (appBaseHost || request.nextUrl.host)
  const upstreamUrl = buildUpstreamUrl(request, matchBaseUrl)

  const upstreamHeaders = await buildUpstreamHeaders(
    request,
    upstreamUrl,
    selfUrl,
    options.forwardAdditionalHeaders,
  )

  let upstreamResponse = await fetch(upstreamUrl.toString(), {
    method: request.method,
    headers: upstreamHeaders,
    body:
      request.method !== 'GET' && request.method !== 'HEAD'
        ? await request.arrayBuffer()
        : null,
    redirect: 'manual',
  })
  upstreamResponse = new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: new Headers(upstreamResponse.headers),
  })

  rewriteSetCookieHeaders(request, upstreamResponse, options)
  return buildUpstreamResponse(
    upstreamResponse,
    matchBaseUrl.toString(),
    selfUrl,
    options,
  )
}

export function createOryMiddleware(options: OryMiddlewareOptions) {
  return (r: NextRequest) => {
    return proxyRequest(r, options)
  }
}
