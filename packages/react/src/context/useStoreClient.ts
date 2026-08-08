import { useContext, useSyncExternalStore } from 'react'

import { FlowStoreContext, FlowStoreState } from './oryStore'

export function useStoreClient() {
  const store = useContext(FlowStoreContext)
  if (!store) {
    throw new Error(
      'useStoreClient must be used within a FlowStoreProvider',
    )
  }

  return new Proxy({} as FlowStoreState, {
    get: (_target, prop) => {
      if (typeof prop === 'symbol') return undefined
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useSyncExternalStore(
        (onChange) => store.subscribe(onChange),
        () => store.getState()[prop as keyof FlowStoreState],
      )
      return store.getState()[prop as keyof FlowStoreState]
    },
  })
}
