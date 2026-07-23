import { oryConfig } from '@/ory.config'
import { Flow, OryFlowType } from '@ory-forms/react'
import { OryComponents } from '@/components/custom/oryComponents'
import { getLoginFlow, OryPageParams } from '@ory-forms/nextjs'

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
