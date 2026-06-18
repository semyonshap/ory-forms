import { getVerificationFlow, OryPageParams } from "@ory/nextjs/app"
import { Verification } from "@/features/ory-elements/features/flows"

import { oryConfig } from "@/ory.config"

export default async function VerificationPage(props: OryPageParams) {
  const flow = await getVerificationFlow(oryConfig, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Verification
      flow={flow}
      config={oryConfig}
    />
  )
}
