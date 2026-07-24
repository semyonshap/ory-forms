'use server'

import { FlowType, RecoveryFlow } from '@ory/client-fetch'
import { initOverrides, QueryParams } from '../types'
import { guessPotentiallyProxiedOrySdkUrl } from '../utils/sdk'
import { serverSideFrontendClient } from './client'
import { getFlowFactory } from './flow'
import { getPublicUrl, toGetFlowParameter } from './utils'

export async function getRecoveryFlow(
  config: { project: { recovery_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<RecoveryFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient().getRecoveryFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Recovery,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    config.project.recovery_ui_url,
  )
}
