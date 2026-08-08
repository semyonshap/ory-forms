import { oryConfig } from '@/ory.config'
import { OryFlowType } from '@ory-forms/react'
import { FormWithRouter } from '@/components/custom/oryForm'
import { OryComponents } from '@/components/custom/oryComponents'
import { getRegistrationFlow, OryPageParams } from '@ory-forms/nextjs'
import { getExtraNodes } from '@/lib/nodes'

export default async function RegistrationPage(props: OryPageParams) {
  const flow = await getRegistrationFlow(oryConfig, props.searchParams)

  if (!flow) return null

  return (
    <FormWithRouter
      config={oryConfig}
      components={OryComponents}
      flow={{ flow, flowType: OryFlowType.Registration }}
      extraNodes={getExtraNodes(oryConfig.project.captcha_enabled)}
    />
  )
}
