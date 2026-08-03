import { redirect } from 'next/navigation'
import {
  instanceOfFlowError,
  instanceOfGenericError,
  ResponseError,
} from '@ory/client-fetch'
import { serverSideFrontendClient } from '../app/client'
import { OryError, QueryParams } from '../types'

type ErrorBody = {
  message?: string
  error?: { message?: string }
}

function isErrorBody(value: unknown): value is ErrorBody {
  return typeof value === 'object' && value !== null
}

async function extractOryErrorMessage(
  error: ResponseError,
): Promise<string | undefined> {
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
  config: { project: { error_ui_url?: string } }
}) {
  const configUrl = config.project.error_ui_url
  if (!configUrl) return

  const errorUrl = new URL(configUrl, baseUrl)
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

export async function getError(
  searchParams: QueryParams,
): Promise<OryError> {
  const params = searchParams

  if ('error' in params) {
    return {
      code: 400,
      message:
        (params['error_description'] as string | undefined) ??
        'An unknown error occurred.',
      status: params['error'] as string,
      timestamp: new Date(),
    }
  }

  const id = params['id']?.toString()
  if (!id) {
    return {
      code: 500,
      message: 'An unknown error occurred.',
      status: 'unknown_error',
      timestamp: new Date(),
    }
  }

  const error = await serverSideFrontendClient()
    .getFlowError({ id })
    .then((res) => {
      const error = res.error

      if (res && instanceOfFlowError(res)) {
        const parsed = error as OryError
        return {
          ...parsed,
          id: res.id,
          timestamp: res.created_at,
        }
      }

      if (error && instanceOfGenericError(error)) {
        return {
          id: id,
          code: error.code ?? 500,
          message: error.message,
          status: error.status,
          reason: error.reason,
          timestamp: new Date(),
        }
      }

      return {
        code: 500,
        message: 'No error details provided',
        status: 'unknown_error',
        timestamp: new Date(),
      }
    })
    .catch((error) => {
      return {
        code: 500,
        message:
          error instanceof Error
            ? error.message
            : 'An unknown error occurred.',
        status: 'unknown_error',
        timestamp: new Date(),
      }
    })

  return error
}
