'use server'

import { FlowType, RegistrationFlow } from '@ory/client-fetch'

import { getFlowFactory } from './flow'
import { toGetFlowParameter } from './utils'
import { orySdkPublicUrl } from '../utils/sdk'
import { serverSideFrontendClient } from './client'
import { initOverrides, QueryParams } from '../types'

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
    baseUrl: orySdkPublicUrl(),
    route: config.project.registration_ui_url,
  })
}
