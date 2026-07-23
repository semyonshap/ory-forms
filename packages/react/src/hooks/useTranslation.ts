import { useTranslation } from "react-i18next"
import { getNodeLabel } from "@ory/client-fetch"

import { UiNodeInput } from "../types"
import { uiTextToFormattedMessage } from "../i18n"

export function useInputTranslation(node: UiNodeInput) {
  const { t } = useTranslation()
  const label = getNodeLabel(node)
  const formattedLabel = label ? uiTextToFormattedMessage(label, t) : ""

  return {
    t,
    label,
    formattedLabel,
  }
}
