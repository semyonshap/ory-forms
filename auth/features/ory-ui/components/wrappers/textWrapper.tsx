import { useTranslation } from "react-i18next"

import { UiNodeText } from "../../types"
import { useFlowStore } from "../../context"
import { uiTextToFormattedMessage } from "../../i18n"

export function TextWrapper({ node }: { node: UiNodeText }) {
  const Node = useFlowStore((state) => state.components.Node)

  const { t } = useTranslation()

  const label = node.meta.label
  const formattedLabel = label && uiTextToFormattedMessage(label, t)

  const text = node.attributes.text
  const formattedText = text && uiTextToFormattedMessage(text, t)

  return (
    <Node.Text
      node={node}
      options={{ label: formattedLabel, description: formattedText }}
    />
  )
}
