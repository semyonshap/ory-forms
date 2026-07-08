import { oryConfig } from "@/ory.config"
import { Flow, OryFlowType } from "@/features/ory-ui"
import { OryComponents } from "@/components/custom/oryComponents"
import { getLoginFlow } from "@/features/ory-nextjs"
import { OryPageParams } from "@/features/ory-nextjs/types"

export default async function LoginPage(props: OryPageParams) {
  const flow = await getLoginFlow(oryConfig, props.searchParams)

  if (!flow) return null

  return (
    <Flow
      config={oryConfig}
      components={OryComponents}
      flow={{ flow, flowType: OryFlowType.Login }}
    />
  )
}
