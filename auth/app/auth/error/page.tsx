import { oryConfig } from '@/ory.config'
import { OryFlowType } from '@ory-forms/react'
import { getErrorFlow, OryPageParams } from '@ory-forms/nextjs'
import { OryComponents } from '@/components/custom/oryComponents'
import { FormWithRouter } from '@/components/custom/oryForm'

export default async function ErrorPage(props: OryPageParams) {
  const flow = await getErrorFlow(oryConfig, props.searchParams)

  return (
    <FormWithRouter
      config={oryConfig}
      components={OryComponents}
      flow={{ flow, flowType: OryFlowType.Error }}
    />
  )
}
