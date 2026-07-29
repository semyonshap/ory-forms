import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import React from 'react'

import { Builder } from '../../lib'
import { renderNodes } from '../render'
import { useFormMessages, useWebAuthnLoader } from '../../hooks'
import { useFlowStoreShallow, useFormState } from '../../context'

export function FormWrapper() {
  const {
    config,
    flowContainer,
    Card,
    nodeSorter,
    groupSorter,
    transientPayload,
  } = useFlowStoreShallow((state) => ({
    config: state.config,
    flowContainer: state.flowContainer,
    Card: state.components.Layout,
    nodeSorter: state.components.nodeSorter,
    groupSorter: state.components.groupSorter,
    transientPayload: state.transientPayload,
  }))
  const formState = useFormState()

  useWebAuthnLoader()

  const { t } = useTranslation()
  const { flowType } = flowContainer

  const nodes = useMemo(() => {
    return Builder(
      { config, flowContainer, formState, t },
      { nodeSorter, groupSorter },
      transientPayload,
    )
  }, [
    formState,
    flowContainer,
    config,
    t,
    nodeSorter,
    groupSorter,
    transientPayload,
  ])

  const result = renderNodes(nodes)

  const Component = Card.Form ?? React.Fragment

  const messages = useFormMessages()

  return <Component options={{ flowType, messages }}>{result}</Component>
}
