import { useState, useEffect, useMemo } from "react"

import { OryFlowContainer } from "../types"
import { useFormState } from "./form/useFormState"

export function useOryFlow(initialFlowContainer: OryFlowContainer) {
  const [flowContainer, setFlowContainer] = useState(initialFlowContainer)

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
