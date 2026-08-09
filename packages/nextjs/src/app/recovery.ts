'use server'

import { FlowType, RecoveryFlow } from '@ory/client-fetch'
import { initOverrides, QueryParams } from '../types'
import { orySdkPublicUrl } from '../utils/sdk'
import { serverSideFrontendClient } from './client'
import { getFlowFactory } from './flow'
import { toGetFlowParameter } from './utils'

export async function getRecoveryFlow(
  config: { project: { recovery_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<RecoveryFlow | null | void> {
  return getFlowFactory({
    params: await params,
    fetchFlowRaw: async () =>
      serverSideFrontendClient().getRecoveryFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    flowType: FlowType.Recovery,
    baseUrl: orySdkPublicUrl(),
    route: config.project.recovery_ui_url,
  })
}
