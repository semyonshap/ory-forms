import { useForm } from 'react-hook-form'

import {
  computeDefaultValues,
  resolveLoginHint,
} from '../lib/form/helpers'
import { buildBaseResolver, buildSettingsResolver } from '../lib'
import { OryFlowContainer, OryFlowType } from '../types'

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

  const isSettings = flowContainer.flowType === OryFlowType.Settings

  const resolver = isSettings
    ? buildSettingsResolver(nodes)
    : buildBaseResolver(nodes)

  const methods = useForm({ defaultValues, resolver })

  useFormAutofocus(nodes, flowContainer.flowType, methods.setFocus)

  return {
    methods,
  }
}
