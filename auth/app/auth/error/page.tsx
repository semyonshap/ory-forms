import { oryConfig } from '@/ory.config'
import { FormWithRouter } from '@/components/custom/oryForm'
import { OryComponents } from '@/components/custom/oryComponents'
import { getFlow, OryFlowType, OryPageParams } from '@ory-forms/nextjs'

export default async function ErrorPage(props: OryPageParams) {
  const flow = await getFlow(
    OryFlowType.Error,
    oryConfig,
    props.searchParams,
  )

  if (!flow) return null

  return (
    <FormWithRouter
      config={oryConfig}
      components={OryComponents}
      flow={flow}
    />
  )
}
