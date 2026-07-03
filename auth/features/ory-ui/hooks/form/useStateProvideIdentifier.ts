import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import {
  FormNode,
  isUiNodeInput,
  OryConfiguration,
  OryFlowContainer,
} from "../../types"
import {
  withoutSingleSignOnNodes,
  isNodeVisible,
  createAnchorNode,
  initFlowUrl,
  createUiText,
  createTextNode,
  createDivGroup,
} from "../../utils"
import { useTranslation } from "react-i18next"

type UseStateProvideIdentifierProps = {
  config: OryConfiguration
  container: OryFlowContainer
  nodes: FormNode[]
  nodeSorter: (a: UiNode, b: UiNode) => number
}

export function useStateProvideIdentifier({
  config,
  container,
  nodes,
  nodeSorter,
}: UseStateProvideIdentifierProps): UiNode[] {
  const { flow } = container
  const { t } = useTranslation()

  const nonSsoNodes = withoutSingleSignOnNodes(nodes).sort(nodeSorter)
  const ssoNodes = nodes
    .filter(isNodeVisible)
    .filter(
      (node) =>
        node.group === UiNodeGroupEnum.Oidc ||
        node.group === UiNodeGroupEnum.Saml,
    )

  const result: UiNode[] = []

  if (ssoNodes.length > 0) {
    result.push(...ssoNodes)
    if (nonSsoNodes.some(isNodeVisible)) {
      result.push()
    }
  }

  result.push(...nonSsoNodes)

  const { registration_enabled } = config.project

  if (registration_enabled) {
    const nodeTextSignUpLabel = createTextNode({
      id: "registration.label",
      text: createUiText({
        keyOrId: "login.registration-label",
        text: "Don't have an account?",
        t,
      }),
    })

    const nodeAnchorSignUp = createAnchorNode({
      id: "registration.button",
      href: initFlowUrl(config.sdk.url, "registration", flow),
      title: createUiText({
        keyOrId: "login.registration-button",
        text: "Sign up",
        t,
      }),
    })

    const divGroup = createDivGroup({
      id: "registration-div",
      class: "inline-flex",
      children: [nodeTextSignUpLabel, nodeAnchorSignUp],
    })

    result.push(...divGroup)
  }

  const identifierNode = nonSsoNodes
    .filter(isUiNodeInput)
    .find((n) => n.attributes.name === "identifier")

  if (identifierNode) {
    const nodeAnchorRecover = createAnchorNode({
      id: "recover-button",
      href: initFlowUrl(config.sdk.url, "recovery", flow),
      title: createUiText({
        keyOrId: "forms.label.recover-account",
        text: "Recover Account",
        t,
      }),
      data: { target: identifierNode.attributes.name },
    })

    result.push(nodeAnchorRecover)
  }

  return result
}
