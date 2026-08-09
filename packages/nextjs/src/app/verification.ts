'use server'

import { FlowType, VerificationFlow } from '@ory/client-fetch'

import { initOverrides, QueryParams } from '../types'
import { orySdkPublicUrl } from '../utils/sdk'
import { serverSideFrontendClient } from './client'
import { getFlowFactory } from './flow'
import { toGetFlowParameter } from './utils'

export async function getVerificationFlow(
  config: { project: { verification_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<VerificationFlow | null | void> {
  return getFlowFactory({
    params: await params,
    fetchFlowRaw: async () =>
      serverSideFrontendClient().getVerificationFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    flowType: FlowType.Verification,
    baseUrl: orySdkPublicUrl(),
    route: config.project.verification_ui_url,
  })
}
