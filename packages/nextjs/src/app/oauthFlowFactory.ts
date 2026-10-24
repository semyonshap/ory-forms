import { redirectToErrorPage } from '../utils/error'
import { OryFlowConfig, QueryParams } from '../types'

export type OAuthHandler<T> = (
  config: OryFlowConfig,
  params: QueryParams | Promise<QueryParams>,
) => Promise<T | null | void>

interface OAuthFlowFactoryOptions<T> {
  baseUrl: string
  config: OryFlowConfig
  params: QueryParams | Promise<QueryParams>
  fetchFlowRaw: (params: QueryParams) => Promise<T>
}

export async function getOAuthFlowFactory<T>({
  baseUrl,
  config,
  params,
  fetchFlowRaw,
}: OAuthFlowFactoryOptions<T>): Promise<T | null> {
  try {
    return await fetchFlowRaw(await params)
  } catch (error) {
    await redirectToErrorPage({
      baseUrl,
      config,
      error,
    })
    return null
  }
}
