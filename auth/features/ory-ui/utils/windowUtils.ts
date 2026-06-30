import { OnRedirectHandler } from "@ory/client-fetch"

export function replaceWindowFlowId(flow: string) {
  const url = new URL(window.location.href)
  url.searchParams.set("flow", flow)
  window.location.href = url.toString()
}

export const onRedirect: OnRedirectHandler = (url, _external) => {
  window.location.assign(url)
}

export function normalizeUrl(url: string): string {
  return url.replace(/\/$/, "")
}
