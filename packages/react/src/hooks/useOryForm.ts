import { useForm } from 'react-hook-form'

import { computeDefaultValues, resolveLoginHint } from '../lib/form/helpers'
import { OryFlowContainer } from '../types'

import { useFormAutofocus } from './useFormAutofocus'

export function useOryForm(flowContainer: OryFlowContainer) {
  const nodes = flowContainer.flow.ui.nodes

  const loginHint = resolveLoginHint(flowContainer)

  const defaultValues = computeDefaultValues(
    {
      active: flowContainer.flow.active,
      ui: { nodes },
    },
    loginHint,
  )

  const methods = useForm({ defaultValues })

  useFormAutofocus(nodes, flowContainer.flowType, methods.setFocus)

  return {
    methods,
  }
}
