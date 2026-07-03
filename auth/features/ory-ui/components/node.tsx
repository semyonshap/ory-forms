import { UiNodeInputAttributesTypeEnum } from "@ory/client-fetch"
import {
  FormContext,
  FormNodeContext,
  ignoredScriptGroups,
  isUiNodeAnchor,
  isUiNodeImage,
  isUiNodeInput,
  isUiNodeScript,
  isUiNodeText,
  UiNodeInput,
  UiNodeInputContext,
} from "../types"
import { useFlowStoreShallow } from "../context"
import { NodeScript } from "./nodes/nodeScript"
import { isIgnoredInputNode } from "../utils"
import {
  MethodButtonWrapper,
  ButtonWrapper,
  AnchorWrapper,
  TextWrapper,
  ImageWrapper,
  InputWrapper,
} from "./wrappers"
import { useNodeInputSetup } from "../hooks"

export const Node = ({ node, context }: FormNodeContext) => {
  if (isUiNodeImage(node)) return ImageWrapper({ node, context })
  else if (isUiNodeText(node)) return TextWrapper({ node, context })
  else if (isUiNodeAnchor(node)) return AnchorWrapper({ node, context })
  else if (isUiNodeInput(node))
    return <NodeInput node={node} context={context} />
  else if (isUiNodeScript(node) && !ignoredScriptGroups.includes(node.group))
    return <NodeScript node={node} />
  return null
}

function NodeInput({ node, context }: UiNodeInputContext) {
  const {
    components: { Node },
  } = useFlowStoreShallow((state) => ({
    components: state.components,
  }))

  useNodeInputSetup(node)

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

      const isMethod = false // TODO: implement method button detection
      if (isMethod) return MethodButtonWrapper({ node })

      return ButtonWrapper({ node })
    default:
      const options = node.attributes.options
      if (Array.isArray(options) && options.length > 0 && Node.Select)
        return <Node.Select node={node} context={context} />

      return InputWrapper({ node })
  }
}
