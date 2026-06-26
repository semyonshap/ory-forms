import {
  UiNode,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  isUiNodeTextAttributes,
} from "@ory/client-fetch"

import { NodeAnchor } from "./nodeAnchor"
import { NodeImage } from "./nodeImage"
import { NodeInput } from "./nodeInput"
import { NodeScript } from "./nodeScript"
import { NodeText } from "./nodeText"

interface Props {
  node: UiNode
  disabled: boolean
  dispatchSubmit: (submitter?: { name: string; value: string }) => void
}

export const Node = ({ node, disabled, dispatchSubmit }: Props) => {
  if (isUiNodeImageAttributes(node.attributes)) {
    return <NodeImage node={node} attributes={node.attributes} />
  }

  if (isUiNodeScriptAttributes(node.attributes)) {
    return <NodeScript node={node} attributes={node.attributes} />
  }

  if (isUiNodeTextAttributes(node.attributes)) {
    return <NodeText node={node} attributes={node.attributes} />
  }

  if (isUiNodeAnchorAttributes(node.attributes)) {
    return <NodeAnchor node={node} attributes={node.attributes} />
  }

  if (isUiNodeInputAttributes(node.attributes)) {
    return (
      <NodeInput
        dispatchSubmit={dispatchSubmit}
        node={node}
        disabled={disabled}
        attributes={node.attributes}
      />
    )
  }

  return null
}
