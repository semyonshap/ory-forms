import { forEach } from "lodash-es"
import { processSetCookieHeaders } from "../utils/utils"
import { OryMiddlewareOptions } from "./middleware"

export function rewriteSetCookieHeaders(
  request: { nextUrl: { protocol: string }; headers: Headers },
  upstreamResponse: Response,
  options: OryMiddlewareOptions,
) {
  if (!upstreamResponse.headers.get("set-cookie")) return

  const cookies = processSetCookieHeaders(
    request.nextUrl.protocol,
    upstreamResponse,
    options,
    request.headers,
  )
  upstreamResponse.headers.delete("set-cookie")
  forEach(cookies, (cookie) => {
    upstreamResponse.headers.append("Set-Cookie", cookie)
  })
}
