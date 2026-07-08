import { pick } from "lodash-es"
import { ApiResponse } from "@ory/client-fetch"
import { parseSetCookie } from "set-cookie-parser"
import { serialize, SerializeOptions } from "cookie"

import { guessCookieDomain } from "./cookie"
import { rewriteJsonResponse } from "./rewrite"
import { FlowParams, QueryParams } from "../types"
import { defaultForwardedHeaders } from "./headers"
import { OryMiddlewareOptions } from "../middleware/middleware"

export function onValidationError<T>(value: T): T {
  return value
}

export async function toFlowParams(
  params: QueryParams,
  getCookieHeader: () => Promise<string | undefined>,
): Promise<FlowParams> {
  return {
    id: params["flow"]?.toString() ?? "",
    cookie: await getCookieHeader(),
    return_to: params["return_to"]?.toString() ?? "",
  }
}

export function processSetCookieHeaders(
  protocol: string,
  fetchResponse: Response,
  options: OryMiddlewareOptions,
  requestHeaders: Headers,
) {
  const isTls =
    protocol === "https:" || requestHeaders.get("x-forwarded-proto") === "https"

  const forwarded = requestHeaders.get("x-forwarded-host")
  const host = forwarded ? forwarded : requestHeaders.get("host")
  const domain =
    host && !options.forceCookieDomain
      ? guessCookieDomain(host ?? "")
      : options.forceCookieDomain

  const setCookieHeader = fetchResponse.headers.get("set-cookie") || ""
  const cookies = parseSetCookie(setCookieHeader, { split: true })

  return cookies.map(({ name, value, ...opts }) =>
    serialize(name, value, {
      ...opts,
      domain,
      secure: isTls,
      encode: (v) => v,
    } as SerializeOptions),
  )
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

export function joinUrlPaths(baseUrl: string, relativeUrl: string): string {
  const base = new URL(baseUrl)
  const relative = new URL(relativeUrl, baseUrl)

  relative.pathname =
    base.pathname.replace(/\/$/, "") +
    "/" +
    relative.pathname.replace(/^\//, "")

  return new URL(relative.toString(), baseUrl).href
}

export function toValue<T extends object>(res: ApiResponse<T>): Promise<T> {
  return res.value().then((v) => rewriteJsonResponse(v))
}
