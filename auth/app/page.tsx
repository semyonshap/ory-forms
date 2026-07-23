import { oryConfig } from "@/ory.config"
import { Flow, OryFlowType } from "@/features/ory-ui"
import { OryComponents } from "@/components/custom/oryComponents"
import { getNavigationFlow } from "@/features/ory-nextjs"

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
