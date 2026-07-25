import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'

import { useFlowStoreShallow, useFormState } from '../context'
import { getCardHeaderText, getGroupHeader } from '../lib'
import { BlockOptionsCard, BlockPropsCard, OryFlowContainerWithState, UiNodeDiv } from '../types'

import { useFormMessages, useFormSubmit } from '.'

export function useCard(node: UiNodeDiv): {
  props: BlockPropsCard
  options: BlockOptionsCard
} {
  const { flowContainer } = useFlowStoreShallow((state) => ({
    flowContainer: state.flowContainer,
  }))
  const formState = useFormState()

  const methods = useFormContext()
  const onSubmit = useFormSubmit(methods)

  const { flow, flowType } = flowContainer

  const { t } = useTranslation()

  const contextContainer: OryFlowContainerWithState = {
    ...flowContainer,
    formState,
  }

  let header = {
    title: '',
    description: '',
  }

  if (node.group === 'default') {
    header = getCardHeaderText(flowContainer.flow.ui, contextContainer, t)
  } else {
    header = getGroupHeader(node.group, t)
  }

  const messages = useFormMessages()

  return {
    props: {
      key: node.group,
      action: flow.ui.action,
      method: flow.ui.method,
      onSubmit: methods.handleSubmit(onSubmit, console.error),
    },
    options: {
      flowType,
      title: header.title,
      description: header.description,
      messages,
    },
  }
}
