import { Flow } from '@ory-forms/react'
import { oryConfig } from '@/ory.config'
import { OryComponents } from '@/components/custom/oryComponents'
import { getFlow, OryFlowType, OryPageParams } from '@ory-forms/nextjs'

export default async function OAuth2LogoutPage(props: OryPageParams) {
  const flow = await getFlow(
    OryFlowType.OAuth2Logout,
    oryConfig,
    props.searchParams,
  )

  if (!flow) return null

  return <Flow config={oryConfig} components={OryComponents} flow={flow} />
}
