import {
  UiNodeGroupEnum,
  UiNodeInputAttributesTypeEnum,
} from "@ory/client-fetch"
import {
  FormNode,
  ignoredScriptGroups,
  isUiNodeAnchor,
  isUiNodeImage,
  isUiNodeInput,
  isUiNodeScript,
  isUiNodeText,
  UiNodeInput,
} from "../types"
import { useFlowStoreShallow } from "../context"
import { NodeScript } from "./nodes/nodeScript"
import { isIgnoredInputNode } from "../utils"
import {
  MethodButtonWrapper,
  ButtonWrapper,
  SsoButtonWrapper,
  AnchorWrapper,
  TextWrapper,
  ImageWrapper,
  SubmitButtonWrapper,
  CodeWrapper,
  InputWrapper,
} from "./wrappers"
import { useNodeInputSetup } from "../hooks"

export const Node = ({ node }: { node: FormNode }) => {
  if (isUiNodeImage(node)) return ImageWrapper({ node })
  else if (isUiNodeText(node)) return TextWrapper({ node })
  else if (isUiNodeAnchor(node)) return AnchorWrapper({ node })
  else if (isUiNodeInput(node)) return <NodeInput node={node} />
  else if (isUiNodeScript(node) && !ignoredScriptGroups.includes(node.group))
    return <NodeScript node={node} />
  return null
}

function NodeInput({ node }: { node: UiNodeInput }) {
  const {
    components: { Node },
  } = useFlowStoreShallow((state) => ({
    components: state.components,
  }))

  useNodeInputSetup(node)

  const { attributes } = node
  switch (attributes.type) {
    case UiNodeInputAttributesTypeEnum.Submit:
      return SubmitButtonWrapper({ node })
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
      if (isIgnoredInputNode(node)) {
        return null
      }

      const isMethod = false // TODO: implement method button detection
      if (isMethod) return MethodButtonWrapper({ node })

      const isSocial =
        (node.attributes.name === "provider" ||
          node.attributes.name === "link") &&
        (node.group === UiNodeGroupEnum.Oidc ||
          node.group === UiNodeGroupEnum.Saml)
      if (isSocial) return SsoButtonWrapper({ node })
      return ButtonWrapper({ node })
    default:
      const options = node.attributes.options
      if (Array.isArray(options) && options.length > 0 && Node.Select)
        return <Node.Select node={node} />

      const isPinCodeInput =
        (attributes.name === "code" && node.group === "code") ||
        (attributes.name === "totp_code" && node.group === "totp")

      if (isPinCodeInput) return CodeWrapper({ node })

      return InputWrapper({ node })
  }
}
