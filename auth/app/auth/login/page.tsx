import { getLoginFlow, OryPageParams } from "@ory/nextjs/app"

import { oryConfig } from "@/ory.config"
import { Flow } from "@/features/ory-ui/components/flow"
import { FlowType } from "@ory/client-fetch"
import { Login } from "@/features/ory-elements"
import { OryComponents } from "@/components/custom/oryComponents"

export default async function LoginPage(props: OryPageParams) {
  const flow = await getLoginFlow(oryConfig, props.searchParams)

  if (!flow) return null

  return (
    <Flow
      config={oryConfig}
      components={OryComponents}
      flow={{ flow, flowType: FlowType.Login }}
    />
  )
  // return <Login config={oryConfig} flow={flow} />
}
