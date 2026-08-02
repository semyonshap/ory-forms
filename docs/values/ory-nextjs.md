# File Contents

## packages/nextjs/src/utils/cookie.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { errorCodes, ErrorResult, parse } from "psl"

function isErrorResult(
  result: unknown,
): result is ErrorResult<keyof errorCodes> {
  return (
    !!result &&
    typeof result === "object" &&
    "error" in result &&
    "input" in result
  )
}

export function guessCookieDomain(url: string) {
  let parsedUrl: string
  try {
    parsedUrl = new URL(url).hostname
  } catch (_) {
    parsedUrl = url
  }

  if (isIPAddress(parsedUrl)) {
    return parsedUrl
  }

  const parsed = parse(parsedUrl)

  if (isErrorResult(parsed)) {
    return undefined
  }

  return parsed.domain ?? parsed.input
}

// Helper function to check if the hostname is an IP address
export function isIPAddress(hostname: string) {
  // IPv4 pattern: four groups of 1-3 digits, separated by dots, each between 0-255
  const ipv4Pattern =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})){3}$/

  // IPv6 pattern: eight groups of 1-4 hexadecimal digits, separated by colons, optional shorthand (::)
  const ipv6Pattern =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$/

  return ipv4Pattern.test(hostname) || ipv6Pattern.test(hostname)
}

```

## packages/nextjs/src/utils/headers.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export const defaultForwardedHeaders = [
  "accept",
  "accept-charset",
  "accept-encoding",
  "accept-language",
  "authorization",
  "cache-control",
  "content-type",
  "cookie",
  "host",
  "user-agent",
  "referer",
]

export const defaultOmitHeaders = [
  "transfer-encoding",
  "content-encoding",
  "content-length",
]

```

## packages/nextjs/src/utils/rewrite.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryMiddlewareOptions } from "src/middleware/middleware"
import { orySdkUrl } from "./sdk"
import { joinUrlPaths } from "./utils"

export function rewriteUrls(
  source: string,
  matchBaseUrl: string,
  selfUrl: string,
  config: OryMiddlewareOptions,
) {
  for (const [_, [matchPath, replaceWith]] of [
    // TODO load these dynamically from the project config

    // Old AX routes
    ["/ui/recovery", config.project?.recovery_ui_url],
    ["/ui/registration", config.project?.registration_ui_url],
    ["/ui/login", config.project?.login_ui_url],
    ["/ui/verification", config.project?.verification_ui_url],
    ["/ui/settings", config.project?.settings_ui_url],
    ["/ui/welcome", config.project?.default_redirect_url],

    // New AX routes
    ["/recovery", config.project?.recovery_ui_url],
    ["/registration", config.project?.registration_ui_url],
    ["/login", config.project?.login_ui_url],
    ["/verification", config.project?.verification_ui_url],
    ["/settings", config.project?.settings_ui_url],
  ].entries()) {
    const match = joinUrlPaths(matchBaseUrl, matchPath || "")
    if (replaceWith && source.startsWith(match)) {
      source = source.replaceAll(
        match,
        new URL(replaceWith, selfUrl).toString(),
      )
    }
  }
  return source.replaceAll(
    matchBaseUrl.replace(/\/$/, ""),
    new URL(selfUrl).toString().replace(/\/$/, ""),
  )
}

/**
 * Rewrites Ory SDK URLs in JSON responses (objects, arrays, strings) with the provided proxy URL.
 *
 * If `proxyUrl` is provided, the SDK URL is replaced with the proxy URL.
 *
 * @param obj - The object to rewrite
 * @param proxyUrl - The proxy URL to replace the SDK URL with
 */
export function rewriteJsonResponse<T extends object>(
  obj: T,
  proxyUrl?: string,
): T {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          // Recursively process each item in the array
          return [
            key,
            value
              .map((item) => {
                if (typeof item === "object" && item !== null) {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                  return rewriteJsonResponse(item, proxyUrl)
                } else if (typeof item === "string" && proxyUrl) {
                  return item.replaceAll(orySdkUrl(), proxyUrl)
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return item
              })
              .filter((item) => item !== undefined),
          ]
        } else if (typeof value === "object" && value !== null) {
          // Recursively remove undefined in nested objects
          return [key, rewriteJsonResponse(value, proxyUrl)]
        } else if (typeof value === "string" && proxyUrl) {
          // Replace SDK URL with the provided proxy URL
          return [key, value.replaceAll(orySdkUrl(), proxyUrl)]
        }
        return [key, value]
      }),
  ) as T
}

```

## packages/nextjs/src/utils/sdk.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { get } from "psl"

/**
 * Gets environment variable, prioritizing the NEXT_PUBLIC_ prefixed version
 */
function getEnv(name: string): string | undefined {
  return process.env[`NEXT_PUBLIC_${name}`] || process.env[name]
}

function orySdkUrlOrNull(): string | null {
  const baseUrl = getEnv("ORY_SDK_URL")
  return baseUrl ? baseUrl.replace(/\/$/, "") : null
}

export function orySdkUrl() {
  const baseUrl = orySdkUrlOrNull()

  if (!baseUrl) {
    throw new Error(
      "You need to set environment variable `NEXT_PUBLIC_ORY_SDK_URL` to your Ory Network SDK URL.",
    )
  }

  return baseUrl
}

export function isProduction() {
  const env = getEnv("VERCEL_ENV") || getEnv("NODE_ENV") || ""
  return ["production", "prod"].indexOf(env) > -1
}

/**
 * Two origins are the same site when their hostnames are equal or share the
 * same registrable domain (eTLD+1). Cookies scoped to the registrable domain
 * are visible to both, so the app can talk to Ory directly without proxying.
 */
function isSameSite(originA: string, originB: string): boolean {
  let hostA: string
  let hostB: string
  try {
    hostA = new URL(originA).hostname
    hostB = new URL(originB).hostname
  } catch {
    return false
  }

  if (hostA === hostB) {
    return true
  }

  // get() returns null for IP addresses, single-label hosts (localhost), and
  // hostnames that are themselves a public suffix (e.g. *.vercel.app, which
  // is on the Public Suffix List, making sibling deployments cross-site).
  const domainA = get(hostA)
  const domainB = get(hostB)
  return Boolean(domainA && domainB && domainA === domainB)
}

export function guessPotentiallyProxiedOrySdkUrl(options?: {
  knownProxiedUrl?: string
}) {
  // The origin the user is actually visiting, derived from the request
  // headers (server) or the browser location. This is ground truth and beats
  // any environment-based guessing, which can disagree with it (e.g.
  // VERCEL_URL on a preview deployment served under a custom domain).
  const visitedOrigin =
    options?.knownProxiedUrl ??
    (typeof window !== "undefined" ? window.location.origin : undefined)

  const sdkUrl = orySdkUrlOrNull()

  if (visitedOrigin && sdkUrl && isSameSite(visitedOrigin, sdkUrl)) {
    // The app and the Ory SDK URL share a site (e.g. a custom domain next to
    // an Ory custom domain on the same registrable domain). Cookies are
    // first-party either way, so no proxying is needed.
    return sdkUrl
  }

  if (isProduction()) {
    if (getEnv("VERCEL_ENV")) {
      const productionUrl = getEnv("VERCEL_PROJECT_PRODUCTION_URL") || ""
      if (productionUrl.indexOf("vercel.app") > -1) {
        // This is a production deployment on Vercel without a custom domain, so we use the vercel app domain.
        return `https://${productionUrl}`.replace(/\/$/, "")
      }
    }

    // In production, we use the production custom domain
    return orySdkUrl()
  }

  if (visitedOrigin) {
    // Cross-site (or no SDK URL configured): route Ory traffic through the
    // visited origin so the proxy middleware can make cookies first-party —
    // anchored to the host the user is on, not the deployment's generated URL.
    return visitedOrigin.replace(/\/$/, "")
  }

  // No request or browser context available — fall back to environment-based
  // guessing.
  if (getEnv("VERCEL_ENV")) {
    // We are in vercel

    // The domain name of the generated deployment URL. Example: *.vercel.app
    // This is only available for preview deployments on Vercel.
    if (getEnv("VERCEL_URL")) {
      return `https://${getEnv("VERCEL_URL")}`.replace(/\/$/, "")
    }

    // This is sometimes set by the render server.
    if (process.env["__NEXT_PRIVATE_ORIGIN"]) {
      return process.env["__NEXT_PRIVATE_ORIGIN"].replace(/\/$/, "")
    }
  }

  // We tried everything. Let's use the SDK URL.
  const final = orySdkUrl()
  console.warn(
    `Unable to determine a suitable SDK URL for setting up the Next.js integration of Ory Elements. Will proceed using default Ory SDK URL "${final}". This is likely not what you want for local development and your authentication and login may not work.`,
  )

  return final
}

```

## packages/nextjs/src/utils/utils.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { serialize, SerializeOptions } from "cookie"
import { parse, splitCookiesString } from "set-cookie-parser"

import { ApiResponse } from "@ory/client-fetch"
import { OryMiddlewareOptions } from "src/middleware/middleware"
import { FlowParams, QueryParams } from "../types"
import { guessCookieDomain } from "./cookie"
import { defaultForwardedHeaders } from "./headers"
import { rewriteJsonResponse } from "./rewrite"

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

  return parse(
    splitCookiesString(fetchResponse.headers.get("set-cookie") || ""),
  )
    .map((cookie) => ({
      ...cookie,
      domain,
      secure: isTls,
      encode: (v: string) => v,
    }))
    .map(({ value, name, ...options }) =>
      serialize(name, value, options as SerializeOptions),
    )
}

export function filterRequestHeaders(
  headers: Headers,
  forwardAdditionalHeaders?: string[],
): Headers {
  const filteredHeaders = new Headers()

  headers.forEach((value, key) => {
    const isValid =
      defaultForwardedHeaders.includes(key) ||
      (forwardAdditionalHeaders ?? []).includes(key)
    if (isValid) filteredHeaders.set(key, value)
  })

  return filteredHeaders
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
  // Remove all undefined values from the response (array and object) using lodash:
  // Remove all (nested) undefined values from the response using lodash
  return res.value().then((v) => rewriteJsonResponse(v))
}

```

## packages/nextjs/src/index.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

```

## packages/nextjs/src/types.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export type QueryParams = { [key: string]: string | string[] | undefined }

export const initOverrides: RequestInit = {
  cache: "no-cache",
}

export type FlowParams = {
  id: string
  cookie: string | undefined
  return_to: string
}

```

## packages/nextjs/src/middleware/index.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export { createOryMiddleware, type OryMiddlewareOptions } from "./middleware"

```


## packages/nextjs/src/middleware/middleware.ts

````typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { NextResponse, type NextRequest } from "next/server"

import { AccountExperienceConfiguration } from "@ory/client-fetch"
import { defaultOmitHeaders } from "../utils/headers"
import { rewriteUrls } from "../utils/rewrite"
import { orySdkUrl } from "../utils/sdk"
import { filterRequestHeaders, processSetCookieHeaders } from "../utils/utils"

export function getProjectApiKey() {
  let baseUrl = ""

  if (process.env["ORY_PROJECT_API_TOKEN"]) {
    baseUrl = process.env["ORY_PROJECT_API_TOKEN"]
  }

  return baseUrl.replace(/\/$/, "")
}

/**
 * @hidden
 * @inline
 * @public
 */
export type OryMiddlewareOptions = {
  /**
   * By default headers are filtered to forward only a fixed list.
   *
   * If you need to forward additional headers you can use this setting to define them.
   */
  forwardAdditionalHeaders?: string[]
  /**
   * If you want to force a specific cookie domain, you can set it here.
   */
  forceCookieDomain?: string
  /**
   * If you want to use a specific project configuration, you can set it here.
   *
   * Make sure to pass the same project configuration that you pass to `@ory/elements-react`
   */
  project?: Partial<AccountExperienceConfiguration>
}

export async function proxyRequest(
  request: NextRequest,
  options: OryMiddlewareOptions,
) {
  const match = [
    "/self-service",
    "/sessions/whoami",
    "/ui",
    "/.well-known/ory",
    "/.ory",
  ]
  if (!match.some((m) => request.nextUrl.pathname.startsWith(m))) {
    return NextResponse.next()
  }

  const appBaseHost = request.headers.get("host")

  const matchBaseUrl = new URL(orySdkUrl())
  const selfUrl =
    request.nextUrl.protocol + "//" + (appBaseHost || request.nextUrl.host)

  const upstreamUrl = request.nextUrl.clone()
  upstreamUrl.hostname = matchBaseUrl.hostname
  upstreamUrl.host = matchBaseUrl.host
  upstreamUrl.protocol = matchBaseUrl.protocol
  upstreamUrl.port = matchBaseUrl.port

  const upstreamRequestHeaders = filterRequestHeaders(
    await request.headers,
    options.forwardAdditionalHeaders,
  )
  upstreamRequestHeaders.set("Host", upstreamUrl.host)

  // Ensures we use the correct URL in redirects like OIDC redirects.
  upstreamRequestHeaders.set("Ory-Base-URL-Rewrite", selfUrl.toString())
  upstreamRequestHeaders.set("Ory-Base-URL-Rewrite-Token", getProjectApiKey())

  // We disable custom domain redirects.
  upstreamRequestHeaders.set("Ory-No-Custom-Domain-Redirect", "true")

  // Fetch the upstream response
  let upstreamResponse = await fetch(upstreamUrl.toString(), {
    method: request.method,
    headers: upstreamRequestHeaders,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.arrayBuffer()
        : null,
    redirect: "manual",
  })
  upstreamResponse = new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    // response may have immutable headers
    headers: new Headers(upstreamResponse.headers),
  })

  // Delete headers that should not be forwarded
  defaultOmitHeaders.forEach((header) => {
    upstreamResponse.headers.delete(header)
  })

  // Modify cookie domain
  if (upstreamResponse.headers.get("set-cookie")) {
    const cookies = processSetCookieHeaders(
      request.nextUrl.protocol,
      upstreamResponse,
      options,
      request.headers,
    )
    upstreamResponse.headers.delete("set-cookie")
    cookies.forEach((cookie) => {
      upstreamResponse.headers.append("Set-Cookie", cookie)
    })
  }

  // Modify location header
  const originalLocation = upstreamResponse.headers.get("location")
  if (originalLocation) {
    let location = originalLocation

    // The legacy hostedui does a redirect to `../self-service` which breaks the NextJS middleware.
    // To fix this, we hard-rewrite `../self-service`.
    //
    // This is not needed with the "new" account experience based on this SDK.
    if (location.startsWith("../self-service")) {
      location = location.replace("../self-service", "/self-service")
    } else if (!location.startsWith("http")) {
      // If the location header is not an absolute URL, we need to make it one for rewriteUrls to properly rewrite it.
      location = new URL(location, matchBaseUrl).toString()
    }

    location = rewriteUrls(location, matchBaseUrl.toString(), selfUrl, options)

    if (!location.startsWith("http")) {
      // console.debug('rewriting location', selfUrl, location, new URL(location, selfUrl).toString())
      location = new URL(location, selfUrl).toString()
    }

    // Next.js throws an error that is completely unhelpful if the location header is not an absolute URL.
    // Therefore, we throw a more helpful error message here.
    if (!location.startsWith("http")) {
      throw new Error(
        "The HTTP location header must be an absolute URL in NextJS middlewares. However, it is not. The resulting HTTP location is `" +
          location +
          "`. This is either a configuration or code bug. Please open an issue on https://github.com/ory/elements.",
      )
    }

    upstreamResponse.headers.set("location", location)
  }

  // Modify buffer
  let modifiedBody = Buffer.from(await upstreamResponse.arrayBuffer())
  if (
    upstreamResponse.headers.get("content-type")?.includes("text/") ||
    upstreamResponse.headers.get("content-type")?.includes("application/json")
  ) {
    const bufferString = modifiedBody.toString("utf-8")
    modifiedBody = Buffer.from(
      rewriteUrls(bufferString, matchBaseUrl.toString(), selfUrl, options),
    )
  }

  // Return the modified response
  return new NextResponse(modifiedBody, {
    headers: upstreamResponse.headers,
    status: upstreamResponse.status,
  })
}

/**
 * Creates a Next.js middleware function that proxies requests to the Ory SDK.
 *
 * This middleware function intercepts requests to the Ory SDK and rewrites the URLs if
 * in development mode or on vercel.com domains.
 *
 * @example
 * ```ts title="middleware.ts"
 * import { createOryMiddleware } from "@ory/elements/nextjs";
 *
 * export default createOryMiddleware({
 *   forwardAdditionalHeaders: ["authorization", "x-custom-header"],
 *   forceCookieDomain: "example.com",
 *   project: {
 *     name: "my-project",
 *   },
 * });
 * ```
 *
 * @param options - The Ory configuration to use for the middleware.
 * @returns The Ory Next.js middleware function
 * @public
 */
export function createOryMiddleware(options: OryMiddlewareOptions) {
  return (r: NextRequest) => {
    return proxyRequest(r, options)
  }
}

````

## packages/nextjs/src/app/client.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Configuration, FrontendApi } from "@ory/client-fetch"

import { orySdkUrl } from "../utils/sdk"

export const serverSideFrontendClient = () =>
  new FrontendApi(
    new Configuration({
      headers: {
        Accept: "application/json",
      },
      basePath: orySdkUrl(),
    }),
  )

```

## packages/nextjs/src/app/error.ts

````typescript
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { QueryParams } from "src/types"
import { serverSideFrontendClient } from "./client"
import { FlowError } from "@ory/client-fetch"

/**
 * Use this method in an app router page to fetch an error from the Ory SDK. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { Error as ErrorComponent } from "@ory/elements-react/theme"
 * import "@ory/elements-react/theme/styles.css"
 * import { getError, getServerSession, OryPageParams } from "@ory/nextjs/app"

 * import config from "@/ory.config"

 * export default async function ErrorPage(props: OryPageParams) {
 *   const error = await getError(props.searchParams)
 *   const session = await getServerSession().catch(() => null)
 *
 *   return (
 *     <ErrorComponent
 *       error={error}
 *       config={config}
 *       components={{ Card: {} }}
 *       session={session ?? undefined}
 *     />
 *   )
 * }
 * ```
 *
 * @param searchParams - the query params of the request. This can be either the search params from the app router or a promise that resolves to the search params. The promise is useful if you want to fetch the search params from a different source, such as a cookie or a header.
 * @returns An object containing the error and error description, or a FlowError object if the error is a flow error. If the error is not a flow error, the error description will be "An unknown error occurred.".
 * @public
 */
export async function getError(
  searchParams: QueryParams | Promise<QueryParams>,
): Promise<{ error: string; error_description: string } | FlowError> {
  const params = await searchParams
  if ("error" in params) {
    return {
      error: params["error"] as string,
      error_description:
        (params["error_description"] as string | undefined) ??
        "An unknown error occurred.",
    }
  }

  const id = params["id"]?.toString() ?? ""
  if (!id) {
    return {
      error: "unknown_error",
      error_description: "An unknown error occurred.",
    }
  }

  try {
    return await serverSideFrontendClient().getFlowError({ id })
  } catch (error) {
    return {
      error: "unknown_error",
      error_description:
        error instanceof Error ? error.message : "An unknown error occurred.",
    }
  }
}

````


## packages/nextjs/src/app/flow.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { redirect, RedirectType } from "next/navigation"
import { FlowType, handleFlowError, ApiResponse } from "@ory/client-fetch"

import { startNewFlow, onRedirect } from "./utils"
import { QueryParams } from "../types"
import { onValidationError } from "../utils/utils"
import { rewriteJsonResponse } from "../utils/rewrite"

/**
 * Restores the `options` field on input node attributes that the pinned
 * `@ory/client-fetch` SDK strips during its generated `FromJSON` step. The
 * SDK rebuilds each attribute object from a hard-coded field list and drops
 * anything it does not recognize, including the enum options the Kratos
 * backend emits for schema-driven dropdowns. Remove this helper once the
 * published SDK carries the field natively.
 *
 * Nodes are matched by `attributes.name` rather than by positional index so
 * that SDK reordering, insertion, or removal of nodes cannot graft options
 * onto the wrong field. Each element of the raw options array is validated
 * to be a non-null object before it is copied over, so malformed JSON
 * cannot inject arbitrary primitive values.
 */
function reattachInputOptions<T>(parsed: T, rawJson: unknown): void {
  const raw = rawJson as {
    ui?: {
      nodes?: Array<{
        attributes?: { name?: unknown; options?: unknown }
      }>
    }
  }
  const parsedAny = parsed as {
    ui?: {
      nodes?: Array<{
        attributes?: { name?: unknown } & Record<string, unknown>
      }>
    }
  }
  const rawNodes = raw?.ui?.nodes
  const parsedNodes = parsedAny?.ui?.nodes
  if (!Array.isArray(rawNodes) || !Array.isArray(parsedNodes)) {
    return
  }

  const rawOptionsByName = new Map<string, unknown[]>()
  for (const node of rawNodes) {
    const name = node?.attributes?.name
    const options = node?.attributes?.options
    if (
      typeof name === "string" &&
      Array.isArray(options) &&
      options.length > 0 &&
      options.every((o) => typeof o === "object" && o !== null)
    ) {
      rawOptionsByName.set(name, options)
    }
  }
  if (rawOptionsByName.size === 0) {
    return
  }

  for (const node of parsedNodes) {
    const attrs = node?.attributes
    if (!attrs || typeof attrs.name !== "string") {
      continue
    }
    const options = rawOptionsByName.get(attrs.name)
    if (options) {
      attrs["options"] = options
    }
  }
}

/**
 * A function that creates a flow fetcher. The flow fetcher can be used
 * to fetch a login, registration, recovery, settings, or verification flow
 * from the SDK.
 *
 * Unless you are building something very custom, you will not need this method. Use it with care and expect
 * potential breaking changes.
 *
 * @param params - The query parameters of the request.
 * @param fetchFlowRaw - A function that fetches the flow from the SDK.
 * @param flowType - The type of the flow.
 * @param baseUrl - The base URL of the application.
 * @param route - The route of the application.
 * @param options - Additional options.
 * @public
 */
export async function getFlowFactory<T extends object>(
  params: QueryParams,
  fetchFlowRaw: () => Promise<ApiResponse<T>>,
  flowType: FlowType,
  baseUrl: string,
  route: string,
  options: {
    disableRewrite?: boolean
  } = { disableRewrite: false },
): Promise<T | null | void> {
  // Guess our own public url using Next.js helpers. We need the hostname, port, and protocol.
  const onRestartFlow = (useFlowId?: string) => {
    if (!useFlowId) {
      return startNewFlow(params, flowType, baseUrl)
    }

    const redirectTo = new URL(route, baseUrl)
    redirectTo.search = new URLSearchParams({
      ...params,
      flow: useFlowId,
    }).toString()
    return redirect(redirectTo.toString(), RedirectType.replace)
  }

  if (!params["flow"]) {
    return onRestartFlow()
  }

  try {
    const rawResponse = await fetchFlowRaw()
    // Clone the raw body before `value()` consumes it so we can recover
    // fields that the pinned `@ory/client-fetch` SDK strips during parsing.
    const rawClone =
      typeof rawResponse.raw?.clone === "function"
        ? rawResponse.raw.clone()
        : undefined
    const parsed = await rawResponse.value()
    if (rawClone) {
      try {
        reattachInputOptions(parsed, await rawClone.json())
      } catch (err) {
        // If the raw body is unavailable or not JSON, fall back to the
        // parsed flow as-is. Log so a broken backend response is still
        // visible in server logs during incident diagnosis.
        // eslint-disable-next-line no-console
        console.warn(
          "reattachInputOptions: failed to read raw flow response; enum options on input nodes may be missing",
          err,
        )
      }
    }
    return options.disableRewrite
      ? parsed
      : rewriteJsonResponse(parsed, baseUrl)
  } catch (error) {
    const errorHandler = handleFlowError({
      onValidationError,
      onRestartFlow,
      onRedirect: onRedirect,
    })

    return await errorHandler(error)
  }
}

```

## packages/nextjs/src/app/index.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use server"

export { getLoginFlow } from "./login"
export { getRegistrationFlow } from "./registration"
export { getRecoveryFlow } from "./recovery"
export { getVerificationFlow } from "./verification"
export { getSettingsFlow } from "./settings"
export { getLogoutFlow } from "./logout"
export { getServerSession } from "./session"
export { getFlowFactory } from "./flow"
export { getError } from "./error"

export type { OryPageParams } from "./utils"

```

## packages/nextjs/src/app/login.ts

````typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, LoginFlow } from "@ory/client-fetch"

import { initOverrides, QueryParams } from "../types"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { serverSideFrontendClient } from "./client"
import { getFlowFactory } from "./flow"
import { getPublicUrl, toGetFlowParameter } from "./utils"

/**
 * Use this method in an app router page to fetch an existing login flow or to create a new one. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { Login } from "@ory/elements-react/theme"
 * import { getLoginFlow, OryPageParams } from "@ory/nextjs/app"
 * import CardHeader from "@/app/auth/login/card-header"
 *
 * import config from "@/ory.config"
 *
 * export default async function LoginPage(props: OryPageParams) {
 *   const flow = await getLoginFlow(config, props.searchParams)
 *
 *   if (!flow) {
 *     return null
 *   }
 *
 *   return (
 *     <Login
 *       flow={flow}
 *       config={config}
 *       components={{
 *         Card: {
 *           Header: CardHeader,
 *         },
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @param config - The Ory configuration object.
 * @param params - The query parameters of the request.
 * @public
 */
export async function getLoginFlow(
  config: { project: { login_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<LoginFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient().getLoginFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Login,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    config.project.login_ui_url,
  )
}

````

## packages/nextjs/src/app/logout.ts

````typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { LogoutFlow } from "@ory/client-fetch"

import { headers } from "next/headers"
import { rewriteJsonResponse } from "../utils/rewrite"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { serverSideFrontendClient } from "./client"
import { getPublicUrl } from "./utils"

/**
 * Use this method in an app router page to create a new logout flow. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { getLogoutFlow } from "@ory/nextjs/app"
 *
 * async function LogoutLink() {
 *   const flow = await getLogoutFlow()
 *
 *   return (
 *     <a href={flow.logout_url}>
 *       Logout
 *     </a>
 *   )
 * }
 *
 * ```
 *
 * @param params - The query parameters of the request.
 * @public
 */
export async function getLogoutFlow({
  returnTo,
}: { returnTo?: string } = {}): Promise<LogoutFlow> {
  const h = await headers()

  const knownProxiedUrl = await getPublicUrl()
  const url = guessPotentiallyProxiedOrySdkUrl({
    knownProxiedUrl,
  })
  return serverSideFrontendClient()
    .createBrowserLogoutFlow({
      cookie: h.get("cookie") ?? "",
      returnTo,
    })
    .then((v: LogoutFlow): LogoutFlow => rewriteJsonResponse(v, url))
}

````

## packages/nextjs/src/app/recovery.ts

````typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, RecoveryFlow } from "@ory/client-fetch"
import { initOverrides, QueryParams } from "../types"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { serverSideFrontendClient } from "./client"
import { getFlowFactory } from "./flow"
import { getPublicUrl, toGetFlowParameter } from "./utils"

/**
 * Use this method in an app router page to fetch an existing recovery flow or to create a new one. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { Recovery } from "@ory/elements-react/theme"
 * import { getRecoveryFlow, OryPageParams } from "@ory/nextjs/app"
 * import config from "@/ory.config"
 * import CardHeader from "@/app/auth/recovery/card-header"
 *
 * export default async function RecoveryPage(props: OryPageParams) {
 *   const flow = await getRecoveryFlow(config, props.searchParams)
 *
 *   if (!flow) {
 *     return null
 *   }
 *
 *   return (
 *     <Recovery
 *       flow={flow}
 *       config={config}
 *       components={{
 *         Card: {
 *           Header: CardHeader,
 *         },
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @param config - The Ory configuration object.
 * @param params - The query parameters of the request.
 * @public
 */
export async function getRecoveryFlow(
  config: { project: { recovery_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<RecoveryFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient().getRecoveryFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Recovery,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    config.project.recovery_ui_url,
  )
}

````

## packages/nextjs/src/app/registration.ts

````typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, RegistrationFlow } from "@ory/client-fetch"

import { initOverrides, QueryParams } from "../types"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { serverSideFrontendClient } from "./client"
import { getFlowFactory } from "./flow"
import { getPublicUrl, toGetFlowParameter } from "./utils"

/**
 * Use this method in an app router page to fetch an existing registration flow or to create a new one. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { Registration } from "@ory/elements-react/theme"
 * import { getRegistrationFlow, OryPageParams } from "@ory/nextjs/app"
 *
 * import config from "@/ory.config"
 * import CardHeader from "@/app/auth/registration/card-header"
 *
 * export default async function RegistrationPage(props: OryPageParams) {
 *   const flow = await getRegistrationFlow(config, props.searchParams)
 *
 *   if (!flow) {
 *     return null
 *   }
 *
 *   return (
 *     <Registration
 *       flow={flow}
 *       config={config}
 *       components={{
 *         Card: {
 *           Header: CardHeader,
 *         },
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @param config - The Ory configuration object.
 * @param params - The query parameters of the request.
 * @public
 */
export async function getRegistrationFlow(
  config: { project: { registration_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<RegistrationFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient().getRegistrationFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Registration,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    config.project.registration_ui_url,
  )
}

````

## packages/nextjs/src/app/session.ts

````typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Session } from "@ory/client-fetch"
import { serverSideFrontendClient } from "./client"
import { getCookieHeader } from "./utils"

/**
 * A helper to fetch the session on the server side. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { getServerSession } from "@ory/nextjs/app"
 *
 * async function MyComponent() {
 *  const session = await getServerSession()
 *
 *  if (!session) {
 *    return <p>No session found</p>
 *  }
 *
 * }
 * ```
 *
 * @returns The session object or null if no session is found.
 * @public
 */
export async function getServerSession(): Promise<Session | null> {
  const cookie = await getCookieHeader()
  return serverSideFrontendClient()
    .toSession({
      cookie,
    })
    .catch(() => null)
}

````

## packages/nextjs/src/app/settings.ts

````typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, SettingsFlow } from "@ory/client-fetch"

import { initOverrides, QueryParams } from "../types"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { serverSideFrontendClient } from "./client"
import { getFlowFactory } from "./flow"
import { getPublicUrl, toGetFlowParameter } from "./utils"

/**
 * Use this method in an app router page to fetch an existing login flow or to create a new one. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { Login } from "@ory/elements-react/theme"
 * import { getLoginFlow, OryPageParams } from "@ory/nextjs/app"
 *
 * import config from "@/ory.config"
 * import CardHeader from "@/app/auth/login/card-header"
 *
 * export default async function LoginPage(props: OryPageParams) {
 *   const flow = await getLoginFlow(config, props.searchParams)
 *
 *   if (!flow) {
 *     return null
 *   }
 *
 *   return (
 *     <Login
 *       flow={flow}
 *       config={config}
 *       components={{
 *         Card: {
 *           Header: CardHeader,
 *         },
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @param config - The Ory configuration object.
 * @param params - The query parameters of the request.
 * @public
 */
export async function getSettingsFlow(
  config: { project: { settings_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<SettingsFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient().getSettingsFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Settings,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    config.project.settings_ui_url,
  )
}

````

## packages/nextjs/src/app/utils.ts

````typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, OnRedirectHandler } from "@ory/client-fetch"
import { headers } from "next/headers"
import { redirect, RedirectType } from "next/navigation"
import { QueryParams } from "../types"
import { ParsedUrlQuery } from "querystring"

export async function getCookieHeader() {
  const h = await headers()
  return h.get("cookie") ?? undefined
}

export const onRedirect: OnRedirectHandler = (url) => {
  redirect(url)
}

/**
 * @internal
 */
export async function toGetFlowParameter(
  params: Promise<QueryParams> | QueryParams,
) {
  return {
    id: (await params)["flow"]?.toString() ?? "",
    cookie: await getCookieHeader(),
  }
}

export async function getPublicUrl() {
  const h = await headers()
  const host = h.get("host")
  if (!host) {
    return undefined
  }
  const protocol = h.get("x-forwarded-proto") || "http"
  return `${protocol}://${host}`
}

/**
 * A utility type that represents the query parameters of a request.
 *
 * This is needed because Next.js does not expose the query parameters as a tye.
 *
 * ```ts
 * import { OryPageParams } from "@ory/nextjs/app"
 *
 * export default async function LoginPage(props: OryPageParams) {
 *   // props.searchParams is a Promise that resolves to an object with the query parameters
 * }
 * ```
 *
 * @public
 */
export interface OryPageParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export function startNewFlow(
  params: QueryParams,
  flowType: FlowType,
  baseUrl: string,
) {
  // Take advantage of the fact, that Ory handles the flow creation for us and redirects the user to the default
  // return to automatically if they're logged in already.
  return redirect(
    new URL(
      "/self-service/" +
        flowType.toString() +
        "/browser?" +
        urlQueryToSearchParams(params).toString(),
      baseUrl,
    ).toString(),
    RedirectType.replace,
  )
}

// Copied over from https://github.com/vercel/next.js/blob/dbd5e1b274d30f9107141475eba116a8118bc346/packages/next/src/shared/lib/router/utils/querystring.ts
// to avoid relying on internal APIs
function stringifyUrlQueryParam(param: unknown): string {
  if (typeof param === "string") {
    return param
  }

  if (
    (typeof param === "number" && !isNaN(param)) ||
    typeof param === "boolean"
  ) {
    return String(param)
  } else {
    return ""
  }
}

export function urlQueryToSearchParams(query: ParsedUrlQuery): URLSearchParams {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(key, stringifyUrlQueryParam(item))
      }
    } else {
      searchParams.set(key, stringifyUrlQueryParam(value))
    }
  }
  return searchParams
}

````

## packages/nextjs/src/app/verification.ts

````typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, VerificationFlow } from "@ory/client-fetch"

import { initOverrides, QueryParams } from "../types"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { serverSideFrontendClient } from "./client"
import { getFlowFactory } from "./flow"
import { getPublicUrl, toGetFlowParameter } from "./utils"

/**
 * Use this method in an app router page to fetch an existing verification flow or to create a new one. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { Verification } from "@ory/elements-react/theme"
 * import { getVerificationFlow, OryPageParams } from "@ory/nextjs/app"
 *
 * import config from "@/ory.config"
 * import CardHeader from "@/app/auth/verification/card-header"
 *
 * export default async function VerificationPage(props: OryPageParams) {
 *   const flow = await getVerificationFlow(config, props.searchParams)
 *
 *   if (!flow) {
 *     return null
 *   }
 *
 *   return (
 *     <Verification
 *       flow={flow}
 *       config={config}
 *       components={{
 *         Card: {
 *           Header: CardHeader,
 *         },
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @param config - The Ory configuration object.
 * @param params - The query parameters of the request.
 * @public
 */
export async function getVerificationFlow(
  config: { project: { verification_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<VerificationFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient().getVerificationFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Verification,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    config.project.verification_ui_url,
  )
}

````

