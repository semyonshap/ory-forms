import { getOAuth2LoginFlow, OryPageParams } from '@ory-forms/nextjs'
import { oryConfig } from '@/ory.config'

export default async function OAuth2LoginPage(props: OryPageParams) {
  await getOAuth2LoginFlow(oryConfig, props.searchParams)
}
