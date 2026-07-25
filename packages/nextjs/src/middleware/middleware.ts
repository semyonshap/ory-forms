import { some } from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { AccountExperienceConfiguration } from '@ory/client-fetch'

import { orySdkUrl } from '../utils/sdk'
import { buildUpstreamResponse } from './response'
import { rewriteSetCookieHeaders } from './cookie'
import { handleConsentSubmit } from '../handlers/consent'
import { handleLogoutSubmit } from '../handlers/logout'
import { handleVerifySubmit } from '../handlers/verify'
import { buildUpstreamUrl, buildUpstreamHeaders } from './request'

export type OryMiddlewareOptions = {
  forwardAdditionalHeaders?: string[]
  forceCookieDomain?: string
  project?: Partial<AccountExperienceConfiguration>
}

async function proxyRequest(request: NextRequest, options: OryMiddlewareOptions) {
  const matchPaths = [
    '/self-service',
    '/custom-service',
    '/sessions/whoami',
    '/ui',
    '/.well-known/ory',
    '/.ory',
  ]

  if (!some(matchPaths, (path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname === '/custom-service/consent' && request.method === 'POST') {
    return handleConsentSubmit(request)
  }

  if (request.nextUrl.pathname === '/custom-service/verify' && request.method === 'POST') {
    return handleVerifySubmit(request)
  }

  if (request.nextUrl.pathname === '/self-service/logout' && request.method === 'POST') {
    return handleLogoutSubmit(request)
  }

  const appBaseHost = request.headers.get('host')
  const matchBaseUrl = new URL(orySdkUrl())
  const selfUrl = request.nextUrl.protocol + '//' + (appBaseHost || request.nextUrl.host)
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
      request.method !== 'GET' && request.method !== 'HEAD' ? await request.arrayBuffer() : null,
    redirect: 'manual',
  })
  upstreamResponse = new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: new Headers(upstreamResponse.headers),
  })

  rewriteSetCookieHeaders(request, upstreamResponse, options)
  return buildUpstreamResponse(upstreamResponse, matchBaseUrl.toString(), selfUrl, options)
}

export function createOryMiddleware(options: OryMiddlewareOptions) {
  return (r: NextRequest) => {
    return proxyRequest(r, options)
  }
}
