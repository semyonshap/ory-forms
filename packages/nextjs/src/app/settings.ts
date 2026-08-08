'use server'

import { FlowType, SettingsFlow } from '@ory/client-fetch'

import { initOverrides, QueryParams } from '../types'
import { orySdkPublicUrl } from '../utils/sdk'
import { serverSideFrontendClient } from './client'
import { getFlowFactory } from './flow'
import { toGetFlowParameter } from './utils'

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
    baseUrl: await orySdkPublicUrl(),
    route: config.project.settings_ui_url,
  })
}
