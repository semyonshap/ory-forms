import { useTranslation } from "react-i18next"
import { getNodeLabel, UiNodeAnchorAttributes } from "@ory/client-fetch"

import { useFlowStore } from "../../context"
import { omitInputAttributes } from "../../utils"
import { UiNodeAnchorContext } from "../../types"
import { uiTextToFormattedMessage } from "../../i18n"

export function AnchorWrapper({ node, context }: UiNodeAnchorContext) {
  const Node = useFlowStore((state) => state.components.Node)
  const { t } = useTranslation()

  const props = omitInputAttributes<UiNodeAnchorAttributes>(node.attributes)
  const label = getNodeLabel(node)
  const formattedLabel = label && uiTextToFormattedMessage(label, t)

  return (
    <Node.Anchor
      node={node}
      props={props}
      options={{ label: formattedLabel }}
      context={context}
    />
  )
}
