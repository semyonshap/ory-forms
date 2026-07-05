import { useState, useEffect } from "react"

import { FlowInputProps } from "../types"
import { useOryFlow } from "../hooks/useOryFlow"
import { createFlowStore, FlowStoreContext } from "./oryStore"
import { computeSdkConfig, computeComponents } from "../utils"

interface OryFlowProviderProps extends FlowInputProps {
  children: React.ReactNode
}

export function OryFlowProvider({
  config,
  flow: initalFlowContainer,
  components,
  children,
}: OryFlowProviderProps) {
  const configResolved = {
    sdk: computeSdkConfig(config.sdk),
    project: config.project,
  }

  const { setFlowContainer, formState, dispatchFormState, flowContainer } =
    useOryFlow(initalFlowContainer)

  const [store] = useState(() =>
    createFlowStore({
      config: configResolved,
      flowContainer,
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
