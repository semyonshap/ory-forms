import {
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
} from '@ory/client-fetch'

import { GroupedNodes } from '../../types'

export function groupNodes({
  nodes,
  excludeGroups = [],
  excludeScripts = true,
  excludeHidden = true,
}: {
  nodes: UiNode[]
  excludeGroups?: UiNodeGroupEnum[]
  excludeScripts?: boolean
  excludeHidden?: boolean
}) {
  const groupsNodes: GroupedNodes = {}
  const groupSet = new Set<UiNodeGroupEnum>()

  const filtered = nodes.filter((node) => {
    if (excludeScripts && isUiNodeScriptAttributes(node.attributes))
      return false

    if (
      excludeHidden &&
      isUiNodeInputAttributes(node.attributes) &&
      node.attributes.type === 'hidden'
    )
      return false

    if (excludeGroups.includes(node.group)) return false

    return true
  })

  for (const node of filtered) {
    const group = node.group
    groupSet.add(group)

    const groupNodes = groupsNodes[group] ?? []
    groupNodes.push(node)
    groupsNodes[group] = groupNodes
  }

  const groups = Array.from(groupSet)

  return { groups, groupsNodes }
}
