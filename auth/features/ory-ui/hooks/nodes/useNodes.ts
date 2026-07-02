import { useCallback, useMemo } from "react"
import {
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
} from "@ory/client-fetch"

import { FormNode } from "../../types"
import {
  getFinalNodes,
  isNodeVisible,
  toAuthMethodPickerOptions,
  withoutSingleSignOnNodes,
} from "../../utils"
import { createFormNode } from "../../utils/factory"
import {
  useFunctionalNodes,
  useNodeGroupsWithVisibleNodes,
} from "./useNodesGroups"
import { useFlowStoreShallow } from "../../context"
import { useTranslation } from "react-i18next"
import { resolveMethod } from "../../i18n/resolver"

export function useNodes() {
  const {
    flow: flowContainer,
    formState,
    nodeSorter,
  } = useFlowStoreShallow((state) => ({
    flow: state.flow,
    formState: state.formState,
    nodeSorter: state.components.nodeSorter,
  }))

  const { flow, flowType } = flowContainer
  const sortNodes = useCallback(
    (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType }),
    [nodeSorter, flowType],
  )

  const formNodes: FormNode[] = flow.ui.nodes.map((node) => ({ ...node }))
  const visibleGroups = useNodeGroupsWithVisibleNodes(formNodes)

  let nodes: FormNode[] = []

  switch (formState.current) {
    case "provide_identifier": {
      const nonSsoNodes = withoutSingleSignOnNodes(formNodes).sort(sortNodes)
      const ssoNodes = formNodes
        .filter(isNodeVisible)
        .filter(
          (node) =>
            node.group === UiNodeGroupEnum.Oidc ||
            node.group === UiNodeGroupEnum.Saml,
        )

      if (ssoNodes.length > 0) {
        nodes.push(...ssoNodes)
        if (nonSsoNodes.some(isNodeVisible)) {
          nodes.push(createFormNode({ type: "div" }))
        }
      }

      nodes.push(...nonSsoNodes)
      break
    }
    case "method_active": {
      const finalNodes = getFinalNodes(visibleGroups, formState.method)

      nodes = [
        ...new Set([
          ...formNodes.filter(
            (n) =>
              isUiNodeScriptAttributes(n.attributes) ||
              n.group === UiNodeGroupEnum.Default ||
              n.group === UiNodeGroupEnum.Profile,
          ),
          ...finalNodes,
        ]),
      ].sort(sortNodes)
      break
    }
    case "select_method": {
      const { t } = useTranslation()

      const authMethodBlocks = toAuthMethodPickerOptions(visibleGroups)
      const methodsData = authMethodBlocks.map((group) => {
        const { title, description } = resolveMethod(group, formNodes, t)
        return { group, title, description }
      })

      const authMethodAdditionalNodes = useFunctionalNodes(formNodes)

      const hiddenNodes = formNodes.filter(
        (n) =>
          n.group !== UiNodeGroupEnum.Captcha &&
          ((n.attributes.node_type === "input" &&
            n.attributes.type === "hidden") ||
            isUiNodeScriptAttributes(n.attributes)),
      )
      break
    }
  }

  return { nodes }
}
