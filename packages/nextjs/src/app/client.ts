import { Configuration, FrontendApi, OAuth2Api } from '@ory/client-fetch'

import { getErrorFlow } from './custom/error'
import { orySdkUrl, oryHydraUrl } from '../utils/sdk'
import { getNavigationFlow } from './custom/navigation'
import { getOAuth2LoginFlow } from './custom/oauth2_login'
import { getOAuth2LogoutFlow } from './custom/oauth2_logout'
import { getOAuth2ConsentFlow } from './custom/oauth2_consent'
import {
  ErrorFlow,
  NavigationFlow,
  OAuth2ConsentFlow,
  OAuth2LogoutFlow,
  OryFlowConfig,
  QueryParams,
} from '../types'

type Params = QueryParams | Promise<QueryParams>

export type FrontendClient = FrontendApi & {
  getNavigationFlow: (
    config: OryFlowConfig,
  ) => Promise<NavigationFlow | null>
  getErrorFlow: (
    config: OryFlowConfig,
    params: Params,
  ) => Promise<ErrorFlow>
}

export type OAuth2Client = OAuth2Api & {
  getOAuth2LoginFlow: (
    config: OryFlowConfig,
    params: Params,
  ) => Promise<void>
  getOAuth2ConsentFlow: (
    config: OryFlowConfig,
    params: Params,
  ) => Promise<OAuth2ConsentFlow>
  getOAuth2LogoutFlow: (params: Params) => Promise<OAuth2LogoutFlow>
}

export const serverSideFrontendClient = (): FrontendClient => {
  const api = new FrontendApi(
    new Configuration({
      headers: { Accept: 'application/json' },
      basePath: orySdkUrl(),
    }),
  ) as FrontendClient

  api.getNavigationFlow = (config) => getNavigationFlow(api, config)
  api.getErrorFlow = (config, params) => getErrorFlow(api, config, params)

  return api
}

export const serverSideOAuth2Client = (): OAuth2Client => {
  const api = new OAuth2Api(
    new Configuration({
      headers: { Accept: 'application/json' },
      basePath: oryHydraUrl(),
    }),
  ) as OAuth2Client

  api.getOAuth2LoginFlow = (config, params) =>
    getOAuth2LoginFlow(api, config, params)
  api.getOAuth2ConsentFlow = (config, params) =>
    getOAuth2ConsentFlow(api, config, params)
  api.getOAuth2LogoutFlow = (params) => getOAuth2LogoutFlow(api, params)

  return api
}
