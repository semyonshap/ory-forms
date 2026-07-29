import { useForm } from 'react-hook-form'

import {
  computeDefaultValues,
  resolveLoginHint,
} from '../lib/form/helpers'
import { buildResolverByMethod } from '../lib'
import { OryFlowContainer } from '../types'

import { useFormAutofocus } from '.'

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

  const resolver = buildResolverByMethod(nodes)

  const methods = useForm({
    defaultValues,
    resolver,
    reValidateMode: 'onSubmit',
  })

  useFormAutofocus(nodes, flowContainer.flowType, methods.setFocus)

  return {
    methods,
  }
}
