import { isUiNodeInputAttributes, UiNode } from '@ory/client-fetch'

import {
  NodeDataAnchor,
  NodeDataDiv,
  NodeDataInput,
  UiNodeAnchor,
  UiNodeDiv,
  UiNodeInput,
} from '../../types'

type NodeDataForNode<N extends UiNode> = N extends UiNodeInput
  ? NodeDataInput
  : N extends UiNodeAnchor
    ? NodeDataAnchor
    : N extends UiNodeDiv
      ? NodeDataDiv
      : Record<string, unknown>

export function withNodeData<
  N extends UiNodeInput | UiNodeAnchor | UiNodeDiv,
>(node: N, extraData: Partial<NodeDataForNode<N>>): N {
  const existingData = node.data || {}
  return {
    ...node,
    data: {
      ...existingData,
      ...extraData,
    },
  }
}

export function getNodeId({ attributes, group }: UiNode) {
  if (isUiNodeInputAttributes(attributes)) {
    if (attributes.type === 'submit' && attributes.value) {
      return `${attributes.name}:${attributes.value}`
    }
    if (attributes.type === 'checkbox' && attributes.value) {
      return `${attributes.name}:${attributes.value}`
    }
    return `${group}:${attributes.name}`
  } else {
    return attributes.id
  }
}
