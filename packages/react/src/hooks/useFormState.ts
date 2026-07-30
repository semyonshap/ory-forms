import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormState } from '../types'
import { useFlowStoreShallow } from '../context'

export function useFormState(): FormState {
  const { flowFormState, loadingInputs, overrideSubmitting } =
    useFlowStoreShallow((s) => ({
      flowFormState: s.flowFormState,
      loadingInputs: s.loadingInputs,
      overrideSubmitting: s.overrideSubmitting,
    }))

  const rhf = useFormContext()

  const rhfFormState = rhf.formState

  return useMemo(() => {
    const isReady =
      loadingInputs.size === 0 &&
      !overrideSubmitting &&
      rhfFormState.isReady

    const isSubmitting = rhfFormState.isSubmitting || overrideSubmitting

    return {
      ...flowFormState,
      isReady,
      isSubmitting,
    }
  }, [flowFormState, loadingInputs, overrideSubmitting, rhfFormState])
}
