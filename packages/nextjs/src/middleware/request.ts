import { NextRequest } from 'next/server'
import { filterRequestHeaders } from '../utils/utils'

function getProjectApiKey() {
  let baseUrl = ''

  if (process.env['ORY_PROJECT_API_TOKEN']) {
    baseUrl = process.env['ORY_PROJECT_API_TOKEN']
  }

  return baseUrl.replace(/\/$/, '')
}

export function buildUpstreamUrl(request: NextRequest, matchBaseUrl: URL) {
  const upstreamUrl = request.nextUrl.clone()
  upstreamUrl.hostname = matchBaseUrl.hostname
  upstreamUrl.host = matchBaseUrl.host
  upstreamUrl.protocol = matchBaseUrl.protocol
  upstreamUrl.port = matchBaseUrl.port
  return upstreamUrl
}

export async function buildUpstreamHeaders(
  request: NextRequest,
  upstreamUrl: URL,
  selfUrl: string,
  forwardAdditionalHeaders?: string[],
) {
  const headers = filterRequestHeaders(
    await request.headers,
    forwardAdditionalHeaders,
  )
  headers.set('Host', upstreamUrl.host)
  headers.set('Ory-Base-URL-Rewrite', selfUrl.toString())
  headers.set('Ory-Base-URL-Rewrite-Token', getProjectApiKey())
  headers.set('Ory-No-Custom-Domain-Redirect', 'true')
  return headers
}
