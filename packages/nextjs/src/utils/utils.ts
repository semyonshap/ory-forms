import { pick } from 'lodash-es'
import { ApiResponse } from '@ory/client-fetch'

import { rewriteJsonResponse } from './rewrite'
import { FlowParams, QueryParams } from '../types'
import { defaultForwardedHeaders } from '../const'

export function onValidationError<T>(value: T): T {
  return value
}

export async function toFlowParams(
  params: QueryParams,
  getCookieHeader: () => Promise<string | undefined>,
): Promise<FlowParams> {
  return {
    id: params['flow']?.toString() ?? '',
    cookie: await getCookieHeader(),
    return_to: params['return_to']?.toString() ?? '',
  }
}

export function filterRequestHeaders(
  headers: Headers,
  forwardAdditionalHeaders?: string[],
): Headers {
  const allowedKeys = [...defaultForwardedHeaders, ...(forwardAdditionalHeaders ?? [])]
  const headersObj = Object.fromEntries(headers.entries())
  const filtered = pick(headersObj, allowedKeys)
  return new Headers(filtered)
}

export function joinUrlPaths(baseUrl: string, relativeUrl: string): string {
  const base = new URL(baseUrl)
  const relative = new URL(relativeUrl, baseUrl)

  relative.pathname = base.pathname.replace(/\/$/, '') + '/' + relative.pathname.replace(/^\//, '')

  return new URL(relative.toString(), baseUrl).href
}

export function toValue<T extends object>(res: ApiResponse<T>): Promise<T> {
  return res.value().then((v) => rewriteJsonResponse(v))
}
