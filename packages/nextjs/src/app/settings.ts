'use server'

import { FlowType, SettingsFlow } from '@ory/client-fetch'

import { initOverrides, QueryParams } from '../types'
import { guessPotentiallyProxiedOrySdkUrl } from '../utils/sdk'
import { serverSideFrontendClient } from './client'
import { getFlowFactory } from './flow'
import { getPublicUrl, toGetFlowParameter } from './utils'

export async function getSettingsFlow(
  config: { project: { settings_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<SettingsFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient().getSettingsFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Settings,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    config.project.settings_ui_url,
  )
}
