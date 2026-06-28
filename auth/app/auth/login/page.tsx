import { getLoginFlow, OryPageParams } from "@ory/nextjs/app"

import { oryConfig } from "@/ory.config"
import { Flow } from "@/features/ory-ui/components/flow"
import { FlowType } from "@ory/client-fetch"

export default async function LoginPage(props: OryPageParams) {
  const flow = await getLoginFlow(oryConfig, props.searchParams)

  if (!flow) return null

  return <Flow config={oryConfig} flow={{ flow, flowType: FlowType.Login }} />
}
