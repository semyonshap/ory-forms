import { redirect, RedirectType } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { FlowType, handleFlowError, ApiResponse } from '@ory/client-fetch'

import { QueryParams, OryFlowConfig } from '../types'
import { startNewFlow, onRedirect } from './utils'
import { onValidationError } from '../utils/utils'
import { redirectToErrorPage } from '../utils/error'
import { rewriteJsonResponse } from '../utils/rewrite'

export async function loadKratosFlow<T extends object>({
  params,
  fetchFlowRaw,
  flowType,
  baseUrl,
  route,
}: {
  params: QueryParams
  fetchFlowRaw: () => Promise<ApiResponse<T>>
  flowType: FlowType
  baseUrl: string
  route: string
}): Promise<T | null | void> {
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

  if (!params['flow']) {
    return onRestartFlow()
  }

  try {
    const rawResponse = await fetchFlowRaw()
    const parsed = await rawResponse.value()
    return rewriteJsonResponse(parsed, baseUrl)
  } catch (error) {
    const errorHandler = handleFlowError({
      onValidationError,
      onRestartFlow,
      onRedirect: onRedirect,
    })

    return await errorHandler(error)
  }
}

export async function loadOAuth2Flow<T>({
  params,
  fetchFlowRaw,
  baseUrl,
  config,
}: {
  params: QueryParams | Promise<QueryParams>
  fetchFlowRaw: (params: QueryParams) => Promise<T>
  baseUrl: string
  config: OryFlowConfig
}): Promise<T | null> {
  try {
    return await fetchFlowRaw(await params)
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    await redirectToErrorPage({
      baseUrl,
      config,
      error,
    })
    return null
  }
}
