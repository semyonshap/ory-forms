'use server'

import { FlowType, SettingsFlow } from '@ory/client-fetch'

import { getFlowFactory } from './flow'
import { toGetFlowParameter } from './utils'
import { orySdkPublicUrl } from '../utils/sdk'
import { serverSideFrontendClient } from './client'
import { initOverrides, QueryParams } from '../types'

export async function getSettingsFlow(
  config: { project: { settings_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<SettingsFlow | null | void> {
  return getFlowFactory({
    params: await params,
    fetchFlowRaw: async () =>
      serverSideFrontendClient().getSettingsFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    flowType: FlowType.Settings,
    baseUrl: orySdkPublicUrl(),
    route: config.project.settings_ui_url,
  })
}
