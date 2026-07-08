import { FlowType, OnRedirectHandler } from "@ory/client-fetch"

import { headers } from "next/headers"
import { QueryParams } from "../types"
import { ParsedUrlQuery } from "querystring"
import { redirect, RedirectType } from "next/navigation"

export async function getCookieHeader() {
  const h = await headers()
  return h.get("cookie") ?? undefined
}

export const onRedirect: OnRedirectHandler = (url) => {
  redirect(url)
}

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

export interface OryPageParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export function startNewFlow(
  params: QueryParams,
  flowType: FlowType,
  baseUrl: string,
) {
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

function stringifyUrlQueryParam(param: unknown): string {
  if (typeof param === "string") return param
  if (
    (typeof param === "number" && !isNaN(param)) ||
    typeof param === "boolean"
  )
    return String(param)
  return ""
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

export function buildActionUrl(
  baseUrl: string,
  path: string,
  params: Record<string, string | undefined>,
): string {
  const search = urlQueryToSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined),
    ) as Record<string, string>,
  )
  return new URL(`${path}?${search.toString()}`, baseUrl).toString()
}
