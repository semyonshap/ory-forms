// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Recovery } from "@/features/ory-elements/features/flows"
import { getRecoveryFlow, OryPageParams } from "@ory/nextjs/app"

import { oryConfig } from "@/ory.config"

export default async function RecoveryPage(props: OryPageParams) {
	const searchParams = await props.searchParams;
	
  const flow = await getRecoveryFlow(oryConfig, searchParams)
  if (!flow) {
    return null
  }

  return (
    <Recovery
      flow={flow}
      config={oryConfig}
    />
  )
}
