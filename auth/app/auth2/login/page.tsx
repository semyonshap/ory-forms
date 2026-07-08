import { OryPageParams, getOAuth2LoginFlow } from "@/features/ory-nextjs"
import { oryConfig } from "@/ory.config"

export default async function OAuth2LoginPage(props: OryPageParams) {
  await getOAuth2LoginFlow(oryConfig, props.searchParams)
}
