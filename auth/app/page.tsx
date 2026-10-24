import { Flow } from '@ory-forms/react'
import { oryConfig } from '@/ory.config'
import { getFlow, OryFlowType } from '@ory-forms/nextjs'
import { OryComponents } from '@/components/custom/oryComponents'

export default async function LoginPage() {
  const flow = await getFlow(OryFlowType.Navigation, oryConfig, {})

  if (!flow) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Flow config={oryConfig} components={OryComponents} flow={flow} />
    </div>
  )
}
