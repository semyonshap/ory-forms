import { useState } from 'react'

import { FlowInputProps } from '../types'
import { createFlowStore, FlowStoreContext } from './oryStore'
import { computeSdkConfig, computeComponents } from '../utils'

interface OryFlowProviderProps extends FlowInputProps {
  children: React.ReactNode
}

export function OryFlowProvider({
  config,
  flow: initialFlowContainer,
  components,
  children,
}: OryFlowProviderProps) {
  const configResolved = {
    sdk: computeSdkConfig(config.sdk),
    project: config.project,
  }

  const [store] = useState(() =>
    createFlowStore({
      config: configResolved,
      components: computeComponents(components),
      flowContainer: initialFlowContainer,
    }),
  )

  return <FlowStoreContext.Provider value={store}>{children}</FlowStoreContext.Provider>
}
