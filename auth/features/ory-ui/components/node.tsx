import { UiNodeInputAttributesTypeEnum } from "@ory/client-fetch"
import {
  ButtonWrapper,
  AnchorWrapper,
  TextWrapper,
  ImageWrapper,
  InputWrapper,
} from "./wrappers"
import {
  NodeRender,
  ignoredScriptGroups,
  isUiNodeAnchor,
  isUiNodeImage,
  isUiNodeInput,
  isUiNodeScript,
  isUiNodeText,
  NodeRenderInput,
  isUiNodeDiv,
} from "../types"
import { isIgnoredInputNode } from "../lib"
import { NodeScript } from "./nodes/nodeScript"
import { useFlowStoreShallow } from "../context"
import { DivWrapper } from "./wrappers/divWrapper"

export const Node = ({ node, attached }: NodeRender) => {
  if (isUiNodeDiv(node)) return DivWrapper({ node, attached })
  else if (isUiNodeImage(node)) return ImageWrapper({ node, attached })
  else if (isUiNodeText(node)) return TextWrapper({ node, attached })
  else if (isUiNodeAnchor(node)) return AnchorWrapper({ node, attached })
  else if (isUiNodeInput(node))
    return <NodeInput node={node} attached={attached} />
  else if (isUiNodeScript(node) && !ignoredScriptGroups.includes(node.group))
    return <NodeScript node={node} />
  return null
}

function NodeInput({ node, attached }: NodeRenderInput) {
  const {
    components: { Node },
  } = useFlowStoreShallow((state) => ({
    components: state.components,
  }))

  const { attributes } = node
  switch (attributes.type) {
    case UiNodeInputAttributesTypeEnum.DatetimeLocal:
      throw new Error("Not implement")
    case UiNodeInputAttributesTypeEnum.Checkbox:
      const isConsent =
        node.group === "oauth2_consent" && node.attributes.node_type === "input"

      if (isConsent) {
        switch (attributes.name) {
          case "grant_scope":
            throw new Error("Not implement")
          default:
            return null
        }
      }

      throw new Error("Not implement")
    case UiNodeInputAttributesTypeEnum.Button:
    case UiNodeInputAttributesTypeEnum.Submit:
      if (isIgnoredInputNode(node)) {
        return null
      }

      return ButtonWrapper({ node, attached })
    default:
      const options = node.attributes.options
      if (Array.isArray(options) && options.length > 0 && Node.Select)
        return <Node.Select node={node} />

      return InputWrapper({ node, attached })
  }
}
