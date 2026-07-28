import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { useMemo } from 'react'
import React from 'react'

import { Builder } from '../../lib'
import { renderNodes } from '../render'
import { useFormMessages, useLogout } from '../../hooks'
import { useFlowStoreShallow, useFormState } from '../../context'

export function FormWrapper() {
  const { config, flowContainer, Card, selectMethod, setOverrideState, nodeSorter, groupSorter } =
    useFlowStoreShallow((state) => ({
      config: state.config,
      flowContainer: state.flowContainer,
      Card: state.components.Layout,
      selectMethod: state.selectMethod,
      setOverrideState: state.setOverrideState,
      nodeSorter: state.components.nodeSorter,
      groupSorter: state.components.groupSorter,
    }))
  const formState = useFormState()

  const { setValue, getValues } = useForm()

  const { t } = useTranslation()
  const { flowType } = flowContainer
  const { logoutFlow, isLoading: logoutLoading } = useLogout(config)

  const nodes = useMemo(() => {
    return Builder(
      { config, flowContainer, formState, t },
      { setValue, getValues, selectMethod, setOverrideState },
      { logoutFlow, logoutLoading },
      { nodeSorter, groupSorter },
    )
  }, [
    formState,
    flowContainer,
    selectMethod,
    setOverrideState,
    config,
    t,
    getValues,
    setValue,
    nodeSorter,
    groupSorter,
    logoutFlow,
    logoutLoading,
  ])

  const result = renderNodes(nodes)

  const Component = Card.Form ?? React.Fragment

  const messages = useFormMessages()

  return <Component options={{ flowType, messages }}>{result}</Component>
}
