import { useTranslation } from "react-i18next"

import { getCardHeaderText, getGroupHeader } from "../lib"
import { useFlowStoreShallow } from "../context"
import { useFormMessages } from "./useFormMessages"
import { OryFlowContainerWithState, UiNodeDiv } from "../types"

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

  const group = node.group

  let header = {
    title: "",
    description: "",
  }

  if (group === "default") {
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
