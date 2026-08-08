import { useTranslation } from 'react-i18next'

import { WrapperText } from '../../types'
import { uiTextToFormattedMessage } from '../../i18n'
import { useStoreClient, useFlowStore } from '../../context'

export function TextWrapper({ node, children, attached }: WrapperText) {
  const store = useStoreClient()

  const Node = useFlowStore((state) => state.components.Node)

  const { t } = useTranslation()

  const label = node.meta.label
  const formattedLabel = label && uiTextToFormattedMessage(label, t)

  const text = node.attributes.text
  const formattedText = text && uiTextToFormattedMessage(text, t)

  return (
    <Node.Text
      node={node}
      options={{ label: formattedLabel, text: formattedText }}
      store={store}
      attached={attached}
    >
      {children}
    </Node.Text>
  )
}
