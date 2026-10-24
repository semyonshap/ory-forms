'use server'

import { FlowType, LoginFlow } from '@ory/client-fetch'

import { getFlowFactory } from './flow'
import { toGetFlowParameter } from './utils'
import { orySdkPublicUrl } from '../utils/sdk'
import { serverSideFrontendClient } from './client'
import { initOverrides, QueryParams } from '../types'

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
    baseUrl: orySdkPublicUrl(),
    route: config.project.login_ui_url,
  })
}
