import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useFlowStoreShallow } from '../context'
import { defaultHiddenMessageIds } from '../types'
import { uiTextToFormattedMessage } from '../i18n'

export function useFormMessages(
  hiddenMessageIds: number[] = defaultHiddenMessageIds,
) {
  const {
    flow: { flow },
    storeMessages,
  } = useFlowStoreShallow((state) => ({
    flow: state.flowContainer,
    storeMessages: state.messages,
  }))

  const { t } = useTranslation()

  return useMemo(() => {
    const filtered =
      flow.ui.messages?.filter((m) => !hiddenMessageIds.includes(m.id)) ??
      []

    const flowMessages = filtered.map((message) => ({
      id: message.id,
      text: uiTextToFormattedMessage(message, t),
      type: message.type,
    }))

    return [...flowMessages, ...storeMessages]
  }, [flow.ui.messages, storeMessages, hiddenMessageIds, t])
}
