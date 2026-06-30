import React, { useState, useEffect } from "react"
import { useFlow } from "../hooks/useFlow"
import { createFlowStore, FlowStoreContext } from "./oryStore"
import { OryConfiguration, FlowInputProps } from "../types"
import { computeSdkConfig } from "../utils"

interface OryFlowProviderProps extends FlowInputProps {
  children: React.ReactNode
}

export function OryFlowProvider({
  config,
  flow,
  components,
  children,
}: OryFlowProviderProps) {
  const { setFlowContainer, formState, dispatchFormState } = useFlow(flow)

  const resolvedConfig: OryConfiguration = {
    sdk: computeSdkConfig(config.sdk),
    project: config.project,
  }

  const [store] = useState(() =>
    createFlowStore({
      config: resolvedConfig,
      flow,
      nodes: [],
      form: null,
      formState,
    }),
  )

  useEffect(() => {
    store.setState({
      config: resolvedConfig,
      flow,
      setFlowContainer,
      formState,
      dispatchFormState,
      components: {
        ...store.getState().components,
        ...(components || {}),
      },
    })
  }, [config, flow, setFlowContainer, formState, dispatchFormState])

  return (
    <FlowStoreContext.Provider value={store}>
      {children}
    </FlowStoreContext.Provider>
  )
}
