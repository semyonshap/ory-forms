import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { FlowFormState } from '../types'
import { parseStateFromFlow } from '../lib'
import { useFlowStoreShallow } from '../context'

export function useFlowFormState() {
  const {
    flowContainer,
    overrideState,
    selectedMethod,
    selectMethod,
    setFlowFormState,
  } = useFlowStoreShallow((state) => ({
    flowContainer: state.flowContainer,
    overrideState: state.overrideState,
    selectedMethod: state.selectedMethod,
    selectMethod: state.selectMethod,
    setFlowFormState: state.setFlowFormState,
  }))

  const {
    formState: { errors },
  } = useFormContext()

  useEffect(() => {
    let next: FlowFormState
    if (overrideState) {
      next = overrideState
    } else if (selectedMethod) {
      next = { current: 'method_active', method: selectedMethod }
    } else {
      next = parseStateFromFlow(flowContainer, errors)
      if (
        next.current === 'method_active' &&
        next.method !== selectedMethod
      ) {
        selectMethod(next.method)
      }
    }
    setFlowFormState(next)
  }, [
    errors,
    overrideState,
    selectedMethod,
    flowContainer,
    selectMethod,
    setFlowFormState,
  ])
}
