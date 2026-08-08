'use server'

import { FlowType, LoginFlow } from '@ory/client-fetch'

import { initOverrides, QueryParams } from '../types'
import { orySdkPublicUrl } from '../utils/sdk'
import { serverSideFrontendClient } from './client'
import { getFlowFactory } from './flow'
import { toGetFlowParameter } from './utils'

export async function getLoginFlow(
  config: { project: { login_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<LoginFlow | null | void> {
  return getFlowFactory({
    params: await params,
    fetchFlowRaw: async () =>
      serverSideFrontendClient().getLoginFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    flowType: FlowType.Login,
    baseUrl: await orySdkPublicUrl(),
    route: config.project.login_ui_url,
  })
}
