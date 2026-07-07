import { useTranslation } from "react-i18next"

import { getCardHeaderText } from "../lib"
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

  const type = node.attributes.data?.type

  let title = ""
  let description = ""

  if (type === "FormCard") {
    const header = getCardHeaderText(flow.flow.ui, contextContainer, t)
    title = header.title
    description = header.description
  }

  const messages = useFormMessages()

  return {
    options: {
      title,
      description,
      messages,
    },
  }
}
