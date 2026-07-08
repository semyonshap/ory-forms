// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, VerificationFlow } from "@ory/client-fetch"

import { initOverrides, QueryParams } from "../types"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { serverSideFrontendClient } from "./client"
import { getFlowFactory } from "./flow"
import { getPublicUrl, toGetFlowParameter } from "./utils"

export async function getVerificationFlow(
  config: { project: { verification_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<VerificationFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient().getVerificationFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Verification,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    config.project.verification_ui_url,
  )
}
