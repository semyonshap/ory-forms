import { oryConfig } from '@/ory.config'
import { OryFlowType } from '@ory-forms/react'
import { FormWithRouter } from '@/components/custom/oryForm'
import { OryComponents } from '@/components/custom/oryComponents'
import { getRecoveryFlow, OryPageParams } from '@ory-forms/nextjs'
import { getExtraNodes } from '@/lib/nodes'

export default async function RecoveryPage(props: OryPageParams) {
  const flow = await getRecoveryFlow(oryConfig, props.searchParams)

  if (!flow) return null

  return (
    <FormWithRouter
      config={oryConfig}
      components={OryComponents}
      flow={{ flow, flowType: OryFlowType.Recovery }}
      extraNodes={getExtraNodes(oryConfig.project.captcha_enabled)}
    />
  )
}
