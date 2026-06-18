import { Recovery } from "@/features/ory-elements/features/flows"
import { getRecoveryFlow, OryPageParams } from "@ory/nextjs/app"

import { oryConfig } from "@/ory.config"

export default async function RecoveryPage(props: OryPageParams) {
  const flow = await getRecoveryFlow(oryConfig, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Recovery
      flow={flow}
      config={oryConfig}
    />
  )
}
