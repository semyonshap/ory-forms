import { useMemo, useContext } from 'react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'

import { FlowStoreContext, FlowStoreState } from './oryStore'
import { FlowFormState, FormState } from '../types'
import { parseStateFromFlow } from '../lib'

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
  const { flowContainer, selectedMethod, loadingInputs } = useFlowStore(
    useShallow((s) => ({
      flowContainer: s.flowContainer,
      selectedMethod: s.selectedMethod,
      loadingInputs: s.loadingInputs,
    })),
  )
  return useMemo(() => {
    const flowState: FlowFormState = selectedMethod
      ? { current: 'method_active', method: selectedMethod }
      : parseStateFromFlow(flowContainer)
    return { ...flowState, isReady: loadingInputs.size === 0 } as FormState
  }, [flowContainer, selectedMethod, loadingInputs])
}
