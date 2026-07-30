import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useFormState } from '.'
import { BuildLayout } from '../lib'
import { useFlowStoreShallow } from '../context'

export function useFormNodes() {
  const {
    config,
    flowContainer,
    nodeSorter,
    groupSorter,
    transientPayload,
    extraNodes,
  } = useFlowStoreShallow((state) => ({
    config: state.config,
    flowContainer: state.flowContainer,
    nodeSorter: state.components.nodeSorter,
    groupSorter: state.components.groupSorter,
    transientPayload: state.transientPayload,
    extraNodes: state.extraNodes,
  }))
  const formState = useFormState()
  const { t } = useTranslation()

  return useMemo(() => {
    return BuildLayout(
      { config, flowContainer, formState, t },
      { nodeSorter, groupSorter },
      transientPayload,
      extraNodes,
    )
  }, [
    formState,
    flowContainer,
    config,
    extraNodes,
    t,
    nodeSorter,
    groupSorter,
    transientPayload,
  ])
}
