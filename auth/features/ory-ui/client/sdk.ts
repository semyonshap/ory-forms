import { Configuration, FrontendApi } from "@ory/client-fetch"
import { OryConfiguration } from "../types"

export function createOryClient(oryConfig: OryConfiguration) {
  const baseUrl = oryConfig?.sdk?.url

  if (!baseUrl) {
    throw new Error("ORY SDK URL is not configured")
  }

  const config = new Configuration({
    basePath: baseUrl.replace(/\/$/, ""),
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })

  return new FrontendApi(config)
}
