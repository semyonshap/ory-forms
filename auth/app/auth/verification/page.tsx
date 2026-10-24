import { oryConfig } from '@/ory.config'
import { FormWithRouter } from '@/components/custom/oryForm'
import { OryComponents } from '@/components/custom/oryComponents'
import { getFlow, OryFlowType, OryPageParams } from '@ory-forms/nextjs'

export default async function VerificationPage(props: OryPageParams) {
  const flow = await getFlow(
    OryFlowType.Verification,
    oryConfig,
    props.searchParams,
  )

  if (!flow) return null

  return (
    <FormWithRouter
      flow={flow}
      components={OryComponents}
      config={oryConfig}
    />
  )
}
