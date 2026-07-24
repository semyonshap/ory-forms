'use server'

import { FlowType, LoginFlow } from '@ory/client-fetch'

import { initOverrides, QueryParams } from '../types'
import { guessPotentiallyProxiedOrySdkUrl } from '../utils/sdk'
import { serverSideFrontendClient } from './client'
import { getFlowFactory } from './flow'
import { getPublicUrl, toGetFlowParameter } from './utils'

export async function getLoginFlow(
  config: { project: { login_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<LoginFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient().getLoginFlowRaw(await toGetFlowParameter(params), initOverrides),
    FlowType.Login,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    config.project.login_ui_url,
  )
}
