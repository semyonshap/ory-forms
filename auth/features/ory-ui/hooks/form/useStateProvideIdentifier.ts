import { useMemo } from "react"
import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { FormNode, OryConfiguration, OryFlowContainer } from "../../types"
import {
  withoutSingleSignOnNodes,
  isNodeVisible,
  createAnchorNode,
  initFlowUrl,
  createUiText,
  createTextNode,
} from "../../utils"

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
  return useMemo(() => {
    const { flow } = container

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
        id: "registration-label",
        text: createUiText({
          keyOrId: "login.registration-label",
          fallback: "Don't have an account?",
        }),
      })

      const nodeAnchorSignUp = createAnchorNode({
        id: "registration-button",
        href: initFlowUrl(config.sdk.url, "registration", flow),
        title: createUiText({
          keyOrId: "login.registration-button",
          fallback: "Sign up",
        }),
        layout: {
          inline: true,
        },
      })

      result.push(nodeTextSignUpLabel, nodeAnchorSignUp)
    }

    return result
  }, [nodes, nodeSorter])
}
