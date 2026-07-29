import { useMemo } from 'react'

import { FlowInputProps } from '../types'
import { computeSdkConfig, computeComponents } from '../utils'
import { createFlowStore, FlowStoreContext } from './oryStore'

interface OryFlowProviderProps extends FlowInputProps {
  children: React.ReactNode
}

export function OryFlowProvider({
  config,
  flow: initialFlowContainer,
  components,
  transientPayload,
  children,
}: OryFlowProviderProps) {
  const configResolved = useMemo(
    () => ({
      sdk: computeSdkConfig(config.sdk),
      project: config.project,
    }),
    [config],
  )

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
      }),
    [
      configResolved,
      componentsResolved,
      initialFlowContainer,
      transientPayload,
    ],
  )

  return (
    <FlowStoreContext.Provider value={store}>
      {children}
    </FlowStoreContext.Provider>
  )
}
