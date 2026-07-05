import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import {
  authMethodPickerExcludedGroups,
  excludedAuthGroups,
  GroupedNodes,
} from "../../types"
import { isNodeVisible } from "./nodes"

export function getFunctionalNodes(nodes: UiNode[]): UiNode[] {
  return nodes.filter((node) => {
    if (!isNodeVisible(node)) {
      return false
    }

    return excludedAuthGroups.includes(node.group)
  })
}

export function toAuthMethodPickerOptions(
  visibleGroups: GroupedNodes,
): UiNodeGroupEnum[] {
  return Object.values(UiNodeGroupEnum)
    .filter((group) => visibleGroups[group]?.length)
    .filter((group) => !authMethodPickerExcludedGroups.includes(group))
}

export function getNodeGroupsWithVisibleNodes(nodes: UiNode[]): GroupedNodes {
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
}
