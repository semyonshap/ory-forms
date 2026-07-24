import { UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { allGroupEnums, excludedAuthGroups, GroupedNodes } from '../../types'
import { isNodeVisible } from './filters'

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

export function nodesToAuthMethodGroups(
  nodes: UiNode[],
  excludeAuthMethods: UiNodeGroupEnum[] = [],
): UiNodeGroupEnum[] {
  const groups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}

  for (const node of nodes) {
    if (node.type === 'script') continue
    const groupNodes = groups[node.group] ?? []
    groupNodes.push(node)
    groups[node.group] = groupNodes
  }

  const excludeSet = new Set([...excludedAuthGroups, ...excludeAuthMethods])
  return allGroupEnums.filter((group) => groups[group]?.length && !excludeSet.has(group))
}

export function getFinalNodes(
  uniqueGroups: GroupedNodes,
  selectedGroup: UiNodeGroupEnum | undefined,
): UiNode[] {
  const hiddenGroupNodes = [
    ...(uniqueGroups.identifier_first ?? []),
    ...(uniqueGroups.default ?? []),
    ...(uniqueGroups.captcha ?? []),
  ].filter((node) => 'type' in node.attributes && node.attributes.type === 'hidden')

  const selectedNodes = selectedGroup ? (uniqueGroups[selectedGroup] ?? []) : []

  return [...hiddenGroupNodes, ...selectedNodes]
}
