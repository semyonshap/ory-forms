import { NextResponse } from "next/server"
import { defaultOmitHeaders } from "../utils/headers"
import { rewriteUrls } from "../utils/rewrite"
import { OryMiddlewareOptions } from "./middleware"

export async function buildUpstreamResponse(
  upstreamResponse: Response,
  matchBaseUrl: string,
  selfUrl: string,
  options: OryMiddlewareOptions,
) {
  defaultOmitHeaders.forEach((h) => upstreamResponse.headers.delete(h))

  const originalLocation = upstreamResponse.headers.get("location")
  if (originalLocation) {
    let location = originalLocation
    if (location.startsWith("../self-service")) {
      location = location.replace("../self-service", "/self-service")
    } else if (!location.startsWith("http")) {
      location = new URL(location, matchBaseUrl).toString()
    }
    location = rewriteUrls(location, matchBaseUrl, selfUrl, options)
    if (!location.startsWith("http")) {
      location = new URL(location, selfUrl).toString()
    }
    if (!location.startsWith("http")) {
      throw new Error(
        "The HTTP location header must be an absolute URL in NextJS middlewares. However, it is not. The resulting HTTP location is `" +
          location +
          "`. This is either a configuration or code bug. Please open an issue on https://github.com/ory/elements.",
      )
    }
    upstreamResponse.headers.set("location", location)
  }

  const body = Buffer.from(await upstreamResponse.arrayBuffer())
  const contentType = upstreamResponse.headers.get("content-type")
  const modifiedBody =
    contentType?.includes("text/") || contentType?.includes("application/json")
      ? Buffer.from(
          rewriteUrls(body.toString("utf-8"), matchBaseUrl, selfUrl, options),
        )
      : body

  return new NextResponse(modifiedBody, {
    headers: upstreamResponse.headers,
    status: upstreamResponse.status,
  })
}
