import { Flow } from '@ory-forms/react'
import { oryConfig } from '@/ory.config'
import { OryComponents } from '@/components/custom/oryComponents'
import { getFlow, OryFlowType, OryPageParams } from '@ory-forms/nextjs'

export default async function LoginPage(props: OryPageParams) {
  const flow = await getFlow(
    OryFlowType.OAuth2Consent,
    oryConfig,
    props.searchParams,
  )

  if (!flow) return null

  return <Flow config={oryConfig} components={OryComponents} flow={flow} />
}
