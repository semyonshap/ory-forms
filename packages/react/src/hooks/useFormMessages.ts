import { useTranslation } from 'react-i18next'

import { useFlowStoreShallow } from '../context'
import { defaultHiddenMessageIds } from '../types'
import { uiTextToFormattedMessage } from '../i18n'

export function useFormMessages(hiddenMessageIds: number[] = defaultHiddenMessageIds) {
  const {
    flow: { flow },
  } = useFlowStoreShallow((state) => ({
    flow: state.flowContainer,
  }))

  const { t } = useTranslation()

  const filtered = flow.ui.messages?.filter((m) => !hiddenMessageIds.includes(m.id)) ?? []

  return filtered.map((message) => ({
    id: message.id,
    text: uiTextToFormattedMessage(message, t),
    type: message.type,
  }))
}
