import { oryConfig } from '@/ory.config'
import { Flow, OryFlowType } from '@ory-forms/react'
import { getErrorFlow, OryPageParams } from '@ory-forms/nextjs'
import { OryComponents } from '@/components/custom/oryComponents'

export default async function ErrorPage(props: OryPageParams) {
  const flow = await getErrorFlow(oryConfig, props.searchParams)

  return (
    <Flow
      config={oryConfig}
      components={OryComponents}
      flow={{ flow, flowType: OryFlowType.Error }}
    />
  )
}
