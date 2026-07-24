import { useTranslation } from 'react-i18next'

import { useFlowStoreShallow } from '../context'
import { getCardHeaderText, getGroupHeader } from '../lib'
import { OryFlowContainerWithState, UiNodeDiv } from '../types'

import { useFormMessages } from './useFormMessages'

export function useDiv(node: UiNodeDiv) {
  const { flow, formState } = useFlowStoreShallow((state) => ({
    flow: state.flowContainer,
    formState: state.formState,
  }))

  const { t } = useTranslation()

  const contextContainer: OryFlowContainerWithState = {
    ...flow,
    formState,
  }

  let header = {
    title: '',
    description: '',
  }

  if (node.group === 'default') {
    header = getCardHeaderText(flow.flow.ui, contextContainer, t)
  } else {
    header = getGroupHeader(node.group, t)
  }

  const messages = useFormMessages()

  return {
    options: {
      title: header.title,
      description: header.description,
      messages,
    },
  }
}
