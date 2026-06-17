// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Settings } from "@/features/ory-elements/features/flows"
import { getSettingsFlow, OryPageParams } from "@ory/nextjs/app"
import { SessionProvider } from "@/features/ory-elements/client"

import { oryConfig } from "@/ory.config"

export default async function SettingsPage(props: OryPageParams) {
	const searchParams = await props.searchParams;

	const flow = await getSettingsFlow(oryConfig, searchParams)

	if (!flow) {
		return null
	}
	
  return (
    <div className="flex flex-col gap-8 items-center mb-8">
      <SessionProvider>
        <Settings
          flow={flow}
          config={oryConfig}
        />
      </SessionProvider>
    </div>
  )
}