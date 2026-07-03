import { useCallback } from "react"
import {
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
} from "@ory/client-fetch"

import { FormNode } from "../../types"
import { getFinalNodes, toAuthMethodPickerOptions } from "../../utils"
import {
  useFunctionalNodes,
  useNodeGroupsWithVisibleNodes,
} from "./useNodesGroups"
import { useFlowStoreShallow } from "../../context"
import { useTranslation } from "react-i18next"
import { resolveMethod } from "../../i18n/resolver"
import { useStateProvideIdentifier } from "../form/useStateProvideIdentifier"

export function useNodes() {
  const { config, flowContainer, formState, nodeSorter } = useFlowStoreShallow(
    (state) => ({
      config: state.config,
      flowContainer: state.flowContainer,
      formState: state.formState,
      nodeSorter: state.components.nodeSorter,
    }),
  )

  const { flow, flowType } = flowContainer
  const sortNodes = useCallback(
    (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType }),
    [nodeSorter, flowType],
  )

  const formNodes: FormNode[] = flow.ui.nodes.map((node) => ({ ...node }))
  const visibleGroups = useNodeGroupsWithVisibleNodes(formNodes)

  // All hooks called unconditionally to satisfy Rules of Hooks
  const identifierNodes = useStateProvideIdentifier({
    config,
    container: flowContainer,
    nodes: formNodes,
    nodeSorter: sortNodes,
  })

  const { t } = useTranslation()

  const authMethodAdditionalNodes = useFunctionalNodes(formNodes)

  let nodes: FormNode[] = []

  switch (formState.current) {
    case "provide_identifier": {
      nodes = identifierNodes
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
      const authMethodBlocks = toAuthMethodPickerOptions(visibleGroups)
      const methodsData = authMethodBlocks.map((group) => {
        const { title, description } = resolveMethod(group, formNodes, t)
        return { group, title, description }
      })

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

  return nodes
}
