import { oryConfig } from '@/ory.config'
import { OryFlowType } from '@ory-forms/react'
import { FormWithCaptcha } from '@/components/custom/oryForm'
import { OryComponents } from '@/components/custom/oryComponents'
import { getRegistrationFlow, OryPageParams } from '@ory-forms/nextjs'

export default async function RegistrationPage(props: OryPageParams) {
  const flow = await getRegistrationFlow(oryConfig, props.searchParams)

  if (!flow) return null

  return (
    <FormWithCaptcha
      config={oryConfig}
      components={OryComponents}
      flow={{ flow, flowType: OryFlowType.Registration }}
    />
  )
}
