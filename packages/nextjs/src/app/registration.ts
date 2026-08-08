'use server'

import { FlowType, RegistrationFlow } from '@ory/client-fetch'

import { initOverrides, QueryParams } from '../types'
import { orySdkPublicUrl } from '../utils/sdk'
import { serverSideFrontendClient } from './client'
import { getFlowFactory } from './flow'
import { toGetFlowParameter } from './utils'

export async function getRegistrationFlow(
  config: { project: { registration_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<RegistrationFlow | null | void> {
  return getFlowFactory({
    params: await params,
    fetchFlowRaw: async () =>
      serverSideFrontendClient().getRegistrationFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    flowType: FlowType.Registration,
    baseUrl: await orySdkPublicUrl(),
    route: config.project.registration_ui_url,
  })
}
