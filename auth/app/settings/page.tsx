import { oryConfig } from '@/ory.config'
import { Flow, OryFlowType } from '@ory-forms/react'
import { OryComponents } from '@/components/custom/oryComponents'
import { getSettingsFlow, OryPageParams } from '@ory-forms/nextjs'

export default async function SettingsPage(props: OryPageParams) {
  const flow = await getSettingsFlow(oryConfig, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <div className="flex flex-col gap-8 items-center mb-8 mt-8">
      <Flow
        flow={{ flow, flowType: OryFlowType.Settings }}
        components={OryComponents}
        config={oryConfig}
      />
    </div>
  )
}
