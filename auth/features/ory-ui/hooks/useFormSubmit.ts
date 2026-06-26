// features/ory-ui/hooks/useFormSubmit.ts
import { useCallback } from "react"
import { useOryStore } from "../store/oryStore"
import { useOryConfig } from "../context/ory-provider"
import { onSubmitLogin } from "./onSubmitLogin"
import { FlowType, UpdateLoginFlowBody } from "@ory/client-fetch"
import { removeEmptyStrings } from "../utils/removeFalsyValues"

export function useFormSubmit() {
  const { flow, flowType, setFlow, setLoading, setError, resetFlow } =
    useOryStore()
  const config = useOryConfig()

  const onSubmit = useCallback(
    async (initialData: Record<string, unknown>) => {
      console.log("data", initialData)
      if (!flow) throw new Error("No active flow.")
      const data = removeEmptyStrings(initialData)
      switch (flowType) {
        case FlowType.Login: {
          await onSubmitLogin({
            flow,
            config,
            body: data as unknown as UpdateLoginFlowBody,
            setFlow,
          })
          break
        }
      }
    },
    [flow, setFlow, setLoading, setError, resetFlow, config],
  )

  return { onSubmit }
}
