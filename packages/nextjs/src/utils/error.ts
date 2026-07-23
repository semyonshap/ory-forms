import { redirect } from "next/navigation"
import { ResponseError } from "@ory/client-fetch"

export function redirectToErrorPage({
  error,
  baseUrl,
  config,
}: {
  baseUrl: string
  error: unknown
  config: { project: { error_ui_url: string } }
}): never {
  const errorUrl = new URL(config.project.error_ui_url, baseUrl)
  errorUrl.searchParams.set("error", "custom_error")

  if (error instanceof ResponseError) {
    let body: any = {}
    try {
      body = error.response.clone().json()
    } catch {}
    const message = body?.error?.message || body?.message || error.message
    errorUrl.searchParams.set("error_description", message)
    if (error.response.status) {
      errorUrl.searchParams.set("status", String(error.response.status))
    }
  } else if (error instanceof Error) {
    errorUrl.searchParams.set("error_description", error.message)
  }

  redirect(errorUrl.toString())
}
