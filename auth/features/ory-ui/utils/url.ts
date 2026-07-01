function buildUrl(
  base: string,
  params: Record<string, string | undefined | null>,
): string {
  const url = new URL(base)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value)
    }
  }
  return url.toString()
}

export function restartFlowUrl(
  flow: {
    request_url?: string
    return_to?: string
    identity_schema?: string
  },
  fallback: string,
): string {
  if (flow.request_url) return flow.request_url

  return buildUrl(fallback, {
    return_to: flow.return_to,
    identity_schema: flow.identity_schema,
  })
}

export function initFlowUrl(
  sdkUrl: string,
  flowType: string,
  flow: {
    return_to?: string
    oauth2_login_challenge?: string
    identity_schema?: string
  },
): string {
  const base = `${sdkUrl}/self-service/${flowType}/browser`

  let returnTo = flow.return_to
  if (!returnTo && typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search)
    const fromQuery = params.get("return_to")
    if (fromQuery) returnTo = fromQuery
  }

  return buildUrl(base, {
    login_challenge: flow.oauth2_login_challenge,
    identity_schema: flow.identity_schema,
    return_to: returnTo,
  })
}
