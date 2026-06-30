import { useState, useEffect, useMemo } from "react"
import { useFormState } from "./form/useFormState"
import { OryFlowContainer } from "../types"

export function useFlow(initialFlow: OryFlowContainer) {
  const [flowContainer, setFlowContainer] = useState(initialFlow)
  const { formState, dispatchFormState } = useFormState(flowContainer)

  useEffect(() => {
    dispatchFormState({ type: "action_flow_update", flow: flowContainer })
  }, [flowContainer, dispatchFormState])

  return useMemo(
    () => ({
      flowContainer,
      setFlowContainer,
      formState,
      dispatchFormState,
    }),
    [flowContainer, setFlowContainer, formState, dispatchFormState],
  )
}
