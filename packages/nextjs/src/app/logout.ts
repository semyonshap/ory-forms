"use server"

import { LogoutFlow } from "@ory/client-fetch"

import { headers } from "next/headers"
import { rewriteJsonResponse } from "../utils/rewrite"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { serverSideFrontendClient } from "./client"
import { getPublicUrl } from "./utils"

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
