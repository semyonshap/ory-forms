import { oryConfig } from '@/ory.config'
import { Flow, OryFlowType } from '@ory-forms/react'
import { OryComponents } from '@/components/custom/oryComponents'
import { getOAuth2LogoutFlow, OryPageParams } from '@ory-forms/nextjs'

export default async function OAuth2LogoutPage(props: OryPageParams) {
  const flow = await getOAuth2LogoutFlow(props.searchParams)

  if (!flow) return null

  return (
    <Flow
      config={oryConfig}
      components={OryComponents}
      flow={{ flow, flowType: OryFlowType.OAuth2Logout }}
    />
  )
}
