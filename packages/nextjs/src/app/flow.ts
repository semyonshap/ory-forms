'use server'

import {
  FlowType,
  LoginFlow,
  RecoveryFlow,
  SettingsFlow,
  VerificationFlow,
  RegistrationFlow,
} from '@ory/client-fetch'

import { toGetFlowParameter } from './utils'
import { getFlowFactory } from './flowFactory'
import { orySdkPublicUrl } from '../utils/sdk'
import { getOAuthFlowFactory } from './oauthFlowFactory'
import { serverSideFrontendClient, serverSideOAuth2Client } from './client'
import {
  initOverrides,
  ErrorFlow,
  NavigationFlow,
  OAuth2ConsentFlow,
  OAuth2LogoutFlow,
  OryFlowConfig,
  OryFlowType,
  QueryParams,
} from '../types'

export type { OryFlowConfig } from '../types'

export interface OryFlowMap {
  [OryFlowType.Login]: LoginFlow
  [OryFlowType.Registration]: RegistrationFlow
  [OryFlowType.Recovery]: RecoveryFlow
  [OryFlowType.Verification]: VerificationFlow
  [OryFlowType.Settings]: SettingsFlow
  [OryFlowType.OAuth2Login]: void
  [OryFlowType.OAuth2Consent]: OAuth2ConsentFlow
  [OryFlowType.OAuth2Logout]: OAuth2LogoutFlow
  [OryFlowType.Navigation]: NavigationFlow
  [OryFlowType.Error]: ErrorFlow
}

type OryFlowHandler<T> = (
  config: OryFlowConfig,
  params: QueryParams,
) => Promise<T | null | void>

const handlers: {
  [K in keyof OryFlowMap]: OryFlowHandler<OryFlowMap[K]>
} = {
  [OryFlowType.Login]: async (config, params) => {
    const parameter = await toGetFlowParameter(params)

    return getFlowFactory({
      params,
      flowType: FlowType.Login,
      fetchFlowRaw: () =>
        serverSideFrontendClient().getLoginFlowRaw(
          parameter,
          initOverrides,
        ),
      baseUrl: orySdkPublicUrl(),
      route: config.project.login_ui_url,
    })
  },
  [OryFlowType.Registration]: async (config, params) => {
    const parameter = await toGetFlowParameter(params)

    return getFlowFactory({
      params,
      flowType: FlowType.Registration,
      fetchFlowRaw: () =>
        serverSideFrontendClient().getRegistrationFlowRaw(
          parameter,
          initOverrides,
        ),
      baseUrl: orySdkPublicUrl(),
      route: config.project.registration_ui_url,
    })
  },
  [OryFlowType.Recovery]: async (config, params) => {
    const parameter = await toGetFlowParameter(params)

    return getFlowFactory({
      params,
      flowType: FlowType.Recovery,
      fetchFlowRaw: () =>
        serverSideFrontendClient().getRecoveryFlowRaw(
          parameter,
          initOverrides,
        ),
      baseUrl: orySdkPublicUrl(),
      route: config.project.recovery_ui_url,
    })
  },
  [OryFlowType.Verification]: async (config, params) => {
    const parameter = await toGetFlowParameter(params)

    return getFlowFactory({
      params,
      flowType: FlowType.Verification,
      fetchFlowRaw: () =>
        serverSideFrontendClient().getVerificationFlowRaw(
          parameter,
          initOverrides,
        ),
      baseUrl: orySdkPublicUrl(),
      route: config.project.verification_ui_url,
    })
  },
  [OryFlowType.Settings]: async (config, params) => {
    const parameter = await toGetFlowParameter(params)

    return getFlowFactory({
      params,
      flowType: FlowType.Settings,
      fetchFlowRaw: () =>
        serverSideFrontendClient().getSettingsFlowRaw(
          parameter,
          initOverrides,
        ),
      baseUrl: orySdkPublicUrl(),
      route: config.project.settings_ui_url,
    })
  },
  [OryFlowType.OAuth2Login]: (config, params) => {
    return getOAuthFlowFactory({
      baseUrl: orySdkPublicUrl(),
      config,
      params,
      fetchFlowRaw: () =>
        serverSideOAuth2Client().getOAuth2LoginFlow(config, params),
    })
  },
  [OryFlowType.OAuth2Consent]: (config, params) => {
    return getOAuthFlowFactory({
      baseUrl: orySdkPublicUrl(),
      config,
      params,
      fetchFlowRaw: () =>
        serverSideOAuth2Client().getOAuth2ConsentFlow(config, params),
    })
  },
  [OryFlowType.OAuth2Logout]: (config, params) => {
    return getOAuthFlowFactory({
      baseUrl: orySdkPublicUrl(),
      config,
      params,
      fetchFlowRaw: () =>
        serverSideOAuth2Client().getOAuth2LogoutFlow(params),
    })
  },
  [OryFlowType.Navigation]: async (config) => {
    return serverSideFrontendClient().getNavigationFlow(config)
  },
  [OryFlowType.Error]: async (config, params) => {
    return serverSideFrontendClient().getErrorFlow(config, params)
  },
}

export async function getFlow<T extends keyof OryFlowMap>(
  flowType: T,
  config: OryFlowConfig,
  params: QueryParams | Promise<QueryParams>,
): Promise<OryFlowMap[T] | null | void> {
  const resolved = await params

  return handlers[flowType](config, resolved)
}
