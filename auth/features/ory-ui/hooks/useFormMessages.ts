import { useMemo } from "react"
import { defaultHiddenMessageIds } from "../types"
import { useFlowStoreShallow } from "../context"
import { useTranslation } from "react-i18next"
import { uiTextToFormattedMessage } from "../i18n"

export function useFormMessages(
  hiddenMessageIds: number[] = defaultHiddenMessageIds,
) {
  const {
    flow: { flow },
  } = useFlowStoreShallow((state) => ({
    flow: state.flowContainer,
  }))

  const { t } = useTranslation()

  return useMemo(() => {
    const filtered =
      flow.ui.messages?.filter((m) => !hiddenMessageIds.includes(m.id)) ?? []

    return filtered.map((message) => ({
      id: message.id,
      text: uiTextToFormattedMessage(message, t),
      type: message.type,
    }))
  }, [flow.ui.messages, hiddenMessageIds, t])
}
