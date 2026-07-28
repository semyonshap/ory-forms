import { UiNode } from '@ory/client-fetch'

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

export function withNodeData<N extends UiNodeInput | UiNodeAnchor | UiNodeDiv>(
  node: N,
  extraData: Partial<NodeDataForNode<N>>,
): N {
  const existingData = node.data || {}
  return {
    ...node,
    data: {
      ...existingData,
      ...extraData,
    },
  }
}
