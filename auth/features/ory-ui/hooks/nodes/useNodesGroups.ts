import { useMemo } from "react"
import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { isNodeVisible } from "../../utils"
import { excludedAuthGroups, GroupedNodes } from "../../types"

export function useFunctionalNodes(nodes: UiNode[]): UiNode[] {
  return nodes.filter(({ group }) => excludedAuthGroups.includes(group))
}

export function useNodeGroupsWithVisibleNodes(nodes: UiNode[]): GroupedNodes {
  return useMemo(() => {
    const groups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}
    const groupRetained: Partial<Record<UiNodeGroupEnum, number>> = {}

    for (const node of nodes) {
      const groupNodes = groups[node.group] ?? []
      const groupCount = groupRetained[node.group] ?? 0

      groupNodes.push(node)
      groups[node.group] = groupNodes

      if (isNodeVisible(node)) {
        groupRetained[node.group] = groupCount + 1
      }
    }

    const finalGroups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}
    for (const [group, count] of Object.entries(groupRetained)) {
      if (count > 0) {
        finalGroups[group as UiNodeGroupEnum] = groups[group as UiNodeGroupEnum]
      }
    }

    return finalGroups
  }, [nodes])
}
