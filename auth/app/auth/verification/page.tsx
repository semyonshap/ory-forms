import { oryConfig } from '@/ory.config'
import { Flow, OryFlowType } from '@ory-forms/react'
import { OryComponents } from '@/components/custom/oryComponents'
import { getVerificationFlow, OryPageParams } from '@ory-forms/nextjs'

export default async function VerificationPage(props: OryPageParams) {
  const flow = await getVerificationFlow(oryConfig, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Flow
      flow={{ flow, flowType: OryFlowType.Verification }}
      components={OryComponents}
      config={oryConfig}
    />
  )
}
