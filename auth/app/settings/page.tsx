import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
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
    <div className="flex flex-col items-center w-full mb-8 mt-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 pl-5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span className="text-sm">Home</span>
        </Link>
        <Flow
          flow={{ flow, flowType: OryFlowType.Settings }}
          components={OryComponents}
          config={oryConfig}
        />
      </div>
    </div>
  )
}
