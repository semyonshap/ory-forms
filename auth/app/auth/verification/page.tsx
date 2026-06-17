// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Verification } from "@/features/ory-elements/features/flows"
import { getVerificationFlow, OryPageParams } from "@ory/nextjs/app"

import { oryConfig } from "@/ory.config"

export default async function VerificationPage(props: OryPageParams) {
	const searchParams = await props.searchParams;

  const flow = await getVerificationFlow(oryConfig, searchParams)
  if (!flow) {
    return null
  }

  return (
    <Verification
      flow={flow}
      config={oryConfig}
    />
  )
}
