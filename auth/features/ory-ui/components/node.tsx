import {
  UiNodeGroupEnum,
  UiNodeInputAttributesTypeEnum,
} from "@ory/client-fetch"
import {
  FormNode,
  ignoredScriptGroups,
  isUiNodeAnchor,
  isUiNodeAuthMethodInput,
  isUiNodeImage,
  isUiNodeInput,
  isUiNodeInputButton,
  isUiNodeInputHidden,
  isUiNodeScript,
  isUiNodeText,
  UiNodeInput,
} from "../types"
import { useFlowStoreShallow } from "../context"
import { NodeScript } from "./nodes/nodeScript"
import { NodeInputHidden } from "./nodes/nodeInputHidden"
import { isIgnoredInputNode } from "../utils"

export const Node = ({ node }: { node: FormNode }) => {
  const {
    components: { Node },
  } = useFlowStoreShallow((state) => ({
    components: state.components,
  }))

  if (isUiNodeImage(node)) return <Node.Image node={node} />
  else if (isUiNodeText(node)) return <Node.Text node={node} />
  else if (isUiNodeAnchor(node)) return <Node.Anchor node={node} />
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

  if (isUiNodeAuthMethodInput(node))
    return <Node.AuthMethodButton node={node} />

  if (isUiNodeInputButton(node)) {
    if (isIgnoredInputNode(node)) {
      return null
    }
    const isSocial =
      (node.attributes.name === "provider" ||
        node.attributes.name === "link") &&
      (node.group === UiNodeGroupEnum.Oidc ||
        node.group === UiNodeGroupEnum.Saml)
    if (isSocial) return <Node.SsoButton node={node} />
    return <Node.Button node={node} />
  }

  if (isUiNodeInputHidden(node)) {
    return <NodeInputHidden node={node} />
  }

  const { attributes } = node
  switch (attributes.type) {
    case UiNodeInputAttributesTypeEnum.Submit:
      return <Node.SubmitButton node={node} />
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
    default:
      const options = node.attributes.options
      if (Array.isArray(options) && options.length > 0 && Node.Select)
        return <Node.Select node={node} />

      const isPinCodeInput =
        (attributes.name === "code" && node.group === "code") ||
        (attributes.name === "totp_code" && node.group === "totp")

      if (isPinCodeInput) return <Node.CodeInput node={node} />

      return <Node.Input node={node} />
  }
}
