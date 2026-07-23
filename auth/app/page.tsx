import { oryConfig } from '@/ory.config'
import { Flow, OryFlowType } from '@ory-forms/react'
import { OryComponents } from '@/components/custom/oryComponents'
import { getNavigationFlow } from '@ory-forms/nextjs'

export default async function LoginPage() {
  const flow = await getNavigationFlow(oryConfig)

  if (!flow) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Flow
        config={oryConfig}
        components={OryComponents}
        flow={{ flow, flowType: OryFlowType.Navigation }}
      />
    </div>
  )
}
