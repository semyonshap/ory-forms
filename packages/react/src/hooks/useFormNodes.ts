import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useFormState } from '.'
import { BuildLayout } from '../lib'
import { useFlowStoreShallow } from '../context'

export function useFormNodes() {
  const {
    config,
    flowNodes,
    flowContainer,
    transientPayload,
    nodeSorter,
    groupSorter,
  } = useFlowStoreShallow((state) => ({
    config: state.config,
    flowNodes: state.flowNodes,
    flowContainer: state.flowContainer,
    transientPayload: state.transientPayload,
    nodeSorter: state.components.nodeSorter,
    groupSorter: state.components.groupSorter,
  }))
  const formState = useFormState()
  const { t } = useTranslation()

  return useMemo(() => {
    if (!flowNodes?.length) return []
    return BuildLayout(
      flowNodes,
      { config, flowContainer, formState, t },
      { nodeSorter, groupSorter },
      transientPayload,
    )
  }, [
    flowNodes,
    formState,
    flowContainer,
    config,
    t,
    nodeSorter,
    groupSorter,
    transientPayload,
  ])
}
