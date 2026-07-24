import { redirect } from 'next/navigation'
import { ResponseError } from '@ory/client-fetch'

type ErrorBody = {
  message?: string
  error?: { message?: string }
}

function isErrorBody(value: unknown): value is ErrorBody {
  return typeof value === 'object' && value !== null
}

async function extractOryErrorMessage(error: ResponseError): Promise<string | undefined> {
  const body: unknown = await error.response
    .clone()
    .json()
    .catch(() => null)

  if (!isErrorBody(body)) {
    return error.message
  }

  return body.error?.message ?? body.message ?? error.message
}

export async function redirectToErrorPage({
  error,
  baseUrl,
  config,
}: {
  baseUrl: string
  error: unknown
  config: { project: { error_ui_url: string } }
}) {
  const errorUrl = new URL(config.project.error_ui_url, baseUrl)
  errorUrl.searchParams.set('error', 'nextjs_error')

  if (error instanceof ResponseError) {
    const message = await extractOryErrorMessage(error)
    if (message) {
      errorUrl.searchParams.set('error_description', message)
    }
    errorUrl.searchParams.set('status', String(error.response.status))
  } else if (error instanceof Error) {
    errorUrl.searchParams.set('error_description', error.message)
  }

  redirect(errorUrl.toString())
}
