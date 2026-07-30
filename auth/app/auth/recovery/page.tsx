import { oryConfig } from '@/ory.config'
import { OryFlowType } from '@ory-forms/react'
import { OryForm } from '@/components/custom/oryForm'
import { OryComponents } from '@/components/custom/oryComponents'
import { getRecoveryFlow, OryPageParams } from '@ory-forms/nextjs'

export default async function RecoveryPage(props: OryPageParams) {
  const flow = await getRecoveryFlow(oryConfig, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <OryForm
      config={oryConfig}
      components={OryComponents}
      flow={{ flow, flowType: OryFlowType.Recovery }}
    />
  )
}
