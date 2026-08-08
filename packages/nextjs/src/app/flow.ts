import { redirect, RedirectType } from 'next/navigation'
import { FlowType, handleFlowError, ApiResponse } from '@ory/client-fetch'

import { QueryParams } from '../types'
import { startNewFlow, onRedirect } from './utils'
import { onValidationError } from '../utils/utils'
import { rewriteJsonResponse } from '../utils/rewrite'

export async function getFlowFactory<T extends object>({
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
