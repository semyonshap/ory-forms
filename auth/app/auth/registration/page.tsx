import { getRegistrationFlow, OryPageParams } from "@ory/nextjs/app"
import { Registration } from "@/features/ory-elements/features/flows"

import { oryConfig } from "@/ory.config"

export default async function RegistrationPage(props: OryPageParams) {
	const flow = await getRegistrationFlow(oryConfig, props.searchParams)

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
