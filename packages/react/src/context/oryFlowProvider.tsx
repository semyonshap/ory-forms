import { useMemo } from 'react'

import { FlowInputProps } from '../types'
import { computeConfig, computeComponents } from '../utils'
import { createFlowStore, FlowStoreContext } from './oryStore'

interface OryFlowProviderProps extends FlowInputProps {
  children: React.ReactNode
}

export function OryFlowProvider({
  config,
  flow: initialFlowContainer,
  components,
  transientPayload,
  setExtraNodes,
  onSuccess,
  onValidationError,
  onError,
  onRedirect,
  children,
}: OryFlowProviderProps) {
  const configResolved = useMemo(() => computeConfig(config), [config])

  const componentsResolved = useMemo(
    () => computeComponents(components),
    [components],
  )

  const store = useMemo(
    () =>
      createFlowStore({
        config: configResolved,
        components: componentsResolved,
        flowContainer: initialFlowContainer,
        transientPayload,
        setExtraNodes,
        onSuccess,
        onValidationError,
        onError,
        onRedirect,
      }),
    [
      configResolved,
      componentsResolved,
      initialFlowContainer,
      transientPayload,
      setExtraNodes,
      onSuccess,
      onValidationError,
      onError,
      onRedirect,
    ],
  )

  return (
    <FlowStoreContext.Provider value={store}>
      {children}
    </FlowStoreContext.Provider>
  )
}
