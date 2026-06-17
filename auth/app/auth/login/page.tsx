import { Login } from "@/features/ory-elements/features/flows"
import { oryConfig } from "@/ory.config"
import { logger } from "@/lib/logger"
import { getLoginFlow, OryPageParams } from "@ory/nextjs/app"

export default async function LoginPage(props: OryPageParams) {
	const searchParams = await props.searchParams;
	
  const flow = await  getLoginFlow(oryConfig, searchParams)
  if (!flow) {
    return null
  }

	logger.info('Login flow retrieved', { flow_id: flow.id })

	return (
		<Login
			flow={flow}
			config={oryConfig}
		/>
	)
}
