import { useMemo, useContext } from 'react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'

import { FormState } from '../types'
import { parseStateFromFlow } from '../lib'

import { FlowStoreContext, FlowStoreState } from './oryStore'

export function useFlowStore<T>(selector: (state: FlowStoreState) => T): T {
  const store = useContext(FlowStoreContext)
  if (!store) {
    throw new Error('useFlowStore must be used within a FlowStoreProvider')
  }
  return useStore(store, selector)
}

export function useFlowStoreShallow<T>(selector: (state: FlowStoreState) => T): T {
  const store = useContext(FlowStoreContext)
  if (!store) throw new Error('...')
  return useStore(store, useShallow(selector))
}

export function useFormState(): FormState {
  const { flowContainer, selectedMethod, loadingInputs, overrideState } = useFlowStore(
    useShallow((s) => ({
      flowContainer: s.flowContainer,
      selectedMethod: s.selectedMethod,
      loadingInputs: s.loadingInputs,
      overrideState: s.overrideState,
    })),
  )

  return useMemo(() => {
    const isReady = loadingInputs.size === 0

    if (overrideState) {
      return { ...overrideState, isReady }
    }

    if (selectedMethod) {
      return { current: 'method_active', method: selectedMethod, isReady }
    }

    return { ...parseStateFromFlow(flowContainer), isReady }
  }, [flowContainer, selectedMethod, loadingInputs, overrideState])
}
