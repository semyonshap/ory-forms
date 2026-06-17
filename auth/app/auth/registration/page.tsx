// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Registration } from "@/features/ory-elements/features/flows"
import { getRegistrationFlow, OryPageParams } from "@ory/nextjs/app"

import { oryConfig } from "@/ory.config"

export default async function RegistrationPage(props: OryPageParams) {
	const searchParams = await props.searchParams;
	
	const flow = await getRegistrationFlow(oryConfig, searchParams)

	if (!flow) {
		return null
	}

	return (
		<Registration
			flow={flow}
			config={oryConfig}
		/>
	)
}
