import { useState, useEffect } from "react"

import { FlowInputProps } from "../types"
import { useFlow } from "../hooks/useFlow"
import { createFlowStore, FlowStoreContext } from "./oryStore"
import { computeSdkConfig, computeComponents } from "../utils"

interface OryFlowProviderProps extends FlowInputProps {
  children: React.ReactNode
}

export function OryFlowProvider({
  config,
  flow,
  components,
  children,
}: OryFlowProviderProps) {
  const { setFlowContainer, formState, dispatchFormState, flowContainer } =
    useFlow(flow)

  const [store] = useState(() =>
    createFlowStore({
      config: {
        sdk: computeSdkConfig(config.sdk),
        project: config.project,
      },
      flowContainer: flow,
      formState,
      components: computeComponents(components),
    }),
  )

  useEffect(() => {
    store.setState({
      flowContainer,
      setFlowContainer,
      formState,
      dispatchFormState,
    })
  }, [flowContainer, setFlowContainer, formState, dispatchFormState])

  return (
    <FlowStoreContext.Provider value={store}>
      {children}
    </FlowStoreContext.Provider>
  )
}
