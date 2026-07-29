import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Builder } from '../lib'
import { useFormState } from '.'
import { useFlowStoreShallow } from '../context'

export function useFormNodes() {
  const {
    config,
    flowContainer,
    nodeSorter,
    groupSorter,
    transientPayload,
  } = useFlowStoreShallow((state) => ({
    config: state.config,
    flowContainer: state.flowContainer,
    nodeSorter: state.components.nodeSorter,
    groupSorter: state.components.groupSorter,
    transientPayload: state.transientPayload,
  }))
  const formState = useFormState()
  const { t } = useTranslation()

  return useMemo(() => {
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
}
