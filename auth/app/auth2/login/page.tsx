import { oryConfig } from '@/ory.config'
import { getFlow, OryFlowType, OryPageParams } from '@ory-forms/nextjs'

export default async function OAuth2LoginPage(props: OryPageParams) {
  await getFlow(OryFlowType.OAuth2Login, oryConfig, props.searchParams)
}
