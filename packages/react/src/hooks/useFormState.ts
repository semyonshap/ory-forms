import { useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import { useFormContext } from 'react-hook-form'

import { FormState } from '../types'
import { useFlowStore } from '../context'
import { parseStateFromFlow } from '../lib'

export function useFormState(): FormState {
  const {
    flowContainer,
    selectedMethod,
    loadingInputs,
    overrideState,
    overrideSubmitting,
  } = useFlowStore(
    useShallow((s) => ({
      flowContainer: s.flowContainer,
      selectedMethod: s.selectedMethod,
      loadingInputs: s.loadingInputs,
      overrideState: s.overrideState,
      overrideSubmitting: s.overrideSubmitting,
    })),
  )

  const rhf = useFormContext()

  const rhfFormState = rhf.formState

  return useMemo(() => {
    const isReady =
      loadingInputs.size === 0 &&
      !overrideSubmitting &&
      rhfFormState.isReady

    const isSubmitting = rhfFormState.isSubmitting || overrideSubmitting

    if (overrideState) {
      return { ...overrideState, isReady, isSubmitting }
    }

    if (selectedMethod) {
      return {
        current: 'method_active',
        method: selectedMethod,
        isReady,
        isSubmitting,
      }
    }

    const flowFormState = parseStateFromFlow(
      flowContainer,
      rhfFormState.errors,
    )

    return {
      ...flowFormState,
      isReady,
      isSubmitting,
    }
  }, [
    flowContainer,
    selectedMethod,
    loadingInputs,
    overrideState,
    overrideSubmitting,
    rhfFormState,
  ])
}
