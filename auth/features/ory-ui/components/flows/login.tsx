"use client"

import { FlowType, LoginFlow } from "@ory/client-fetch"
import { useOryStore } from "../../store/oryStore"
import { useEffect } from "react"
import { Flow } from "./flow"

export function Login({ flow }: { flow: LoginFlow }) {
  const { setFlow, resetFlow } = useOryStore()

  useEffect(() => {
    setFlow(flow, FlowType.Login)
    return () => resetFlow()
  }, [flow, setFlow, resetFlow])

  return (
    <>
      <div className="container max-w-md mx-auto mt-20">
        <Flow flow={flow} />
      </div>
    </>
  )
}
