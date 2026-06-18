import { getLoginFlow, OryPageParams } from "@ory/nextjs/app"
import { Login } from "@/features/ory-elements/features/flows"

import { oryConfig } from "@/ory.config"

export default async function LoginPage(props: OryPageParams) {
  const flow = await getLoginFlow(oryConfig, props.searchParams)

  if (!flow) {
    return null
  }

	return (
		<Login
			flow={flow}
			config={oryConfig}
		/>
	)
}
