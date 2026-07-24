import { useTranslation } from 'react-i18next'
import { getNodeLabel, UiNodeAnchorAttributes } from '@ory/client-fetch'

import { useFlowStore } from '../../context'
import { omitInputAttributes } from '../../utils'
import { NodeRenderAnchor } from '../../types'
import { uiTextToFormattedMessage } from '../../i18n'

export function AnchorWrapper({ node, attached }: NodeRenderAnchor) {
  const Node = useFlowStore((state) => state.components.Node)
  const { t } = useTranslation()

  const props = omitInputAttributes<UiNodeAnchorAttributes>(node.attributes)
  const label = getNodeLabel(node)
  const formattedLabel = label && uiTextToFormattedMessage(label, t)

  return (
    <Node.Anchor
      node={node}
      props={{ ...props }}
      options={{ label: formattedLabel, variant: node.data?.variant || 'button' }}
      attached={attached}
    />
  )
}
