import { useForm } from 'react-hook-form'
import { useEffect, useMemo } from 'react'

import { useFormAutofocus } from '.'
import { buildResolverByMethod } from '../lib'
import { useFlowStoreShallow } from '../context'
import {
  computeDefaultValues,
  resolveLoginHint,
} from '../lib/form/helpers'

export function useOryForm() {
  const {
    config,
    flowContainer,
    flowFormState,
    setExtraNodes,
    transientPayload,
    setFlowNodes,
  } = useFlowStoreShallow((s) => ({
    config: s.config,
    flowContainer: s.flowContainer,
    flowFormState: s.flowFormState,
    setExtraNodes: s.setExtraNodes,
    transientPayload: s.transientPayload,
    setFlowNodes: s.setFlowNodes,
  }))

  const { flow } = flowContainer

  const flowNodes = useMemo(() => {
    if (!flow.ui.nodes.length) return []
    const extraNodes = setExtraNodes?.(config, flowFormState) ?? []
    return flow.ui.nodes.concat(extraNodes)
  }, [flow, setExtraNodes, config, flowFormState])

  useEffect(() => {
    setFlowNodes(flowNodes)
  }, [flowNodes, setFlowNodes])

  const loginHint = resolveLoginHint(flowContainer)
  const defaultValues = computeDefaultValues(
    {
      active: flowContainer.flow.active,
      ui: { nodes: flowNodes },
    },
    transientPayload,
    loginHint,
  )

  const resolver = buildResolverByMethod(flowNodes, transientPayload)

  const methods = useForm({
    defaultValues,
    resolver,
    reValidateMode: 'onSubmit',
  })

  useFormAutofocus(flowNodes, flowContainer.flowType, methods.setFocus)

  return {
    methods,
  }
}
