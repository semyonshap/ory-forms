import { getRecoveryFlow, OryPageParams } from "@ory/nextjs/app"

import { oryConfig } from "@/ory.config"
import { Flow, OryFlowType } from "@/features/ory-ui"
import { OryComponents } from "@/components/custom/oryComponents"

export default async function RecoveryPage(props: OryPageParams) {
  const flow = await getRecoveryFlow(oryConfig, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Flow
      config={oryConfig}
      components={OryComponents}
      flow={{ flow, flowType: OryFlowType.Recovery }}
    />
  )
}
