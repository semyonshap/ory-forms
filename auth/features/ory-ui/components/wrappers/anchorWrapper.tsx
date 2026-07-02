import { getNodeLabel, UiNodeAnchorAttributes } from "@ory/client-fetch"

import { UiNodeAnchor } from "../../types"
import { useFlowStore } from "../../context"
import { omitInputAttributes } from "../../utils"
import { uiTextToFormattedMessage } from "../../i18n"
import { useTranslation } from "react-i18next"

export function AnchorWrapper({ node }: { node: UiNodeAnchor }) {
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
    />
  )
}
