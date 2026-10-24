import { Flow } from '@ory-forms/react'
import {
  getFlow,
  getServerSession,
  OryFlowType,
  type OryPageParams,
} from '@ory-forms/nextjs'

import { oryConfig } from '@/ory.config'

export default async function Page(props: OryPageParams) {
  const session = await getServerSession()

  if (session.status !== 'authenticated') {
    const flow = await getFlow(
      OryFlowType.Login,
      oryConfig,
      props.searchParams,
    )

    if (!flow) return null

    return (
      <div className="w-full max-w-sm">
        <Flow config={oryConfig} flow={flow} />
      </div>
    )
  }

  return (
    <p className="text-sm">Signed in as {session.session?.identity?.id}</p>
  )
}
