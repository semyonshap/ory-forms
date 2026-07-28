import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { computeDefaultValues, resolveLoginHint } from '../lib/form/helpers'
import { buildZodSchema } from '../lib'
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

  const schema = buildZodSchema(nodes)
  const resolver = zodResolver(schema)

  const methods = useForm({ defaultValues, resolver })

  useFormAutofocus(nodes, flowContainer.flowType, methods.setFocus)

  return {
    methods,
  }
}
