import { ReactNode } from "react"

import { Node } from "./node"
import { getNodeId } from "../lib"
import { FormContext, FormNode, isUiNodeDiv } from "../types"

function buildContextMap(nodes: FormNode[]): FormContext {
  const contextMap: FormContext = {}

  for (const node of nodes) {
    const target = node.data?.target
    if (!target) continue

    contextMap[target] ??= []
    contextMap[target].push(<Node key={getNodeId(node)} node={node} />)
  }

  return contextMap
}

function renderRange(
  nodes: FormNode[],
  contextMap: FormContext,
  start: number,
  endId?: string,
): { result: ReactNode[]; nextIndex: number } {
  const result: ReactNode[] = []
  let i = start

  while (i < nodes.length) {
    const node = nodes[i]

    if (isUiNodeDiv(node)) {
      const id = node.attributes.id
      const divType = node.attributes.data?.type
      const divEnd = node.attributes.data?.end

      if (!!endId && id === endId && !divType) {
        return { result, nextIndex: i + 1 }
      }

      if (!!divType && !!divEnd) {
        const { result: children, nextIndex } = renderRange(
          nodes,
          contextMap,
          i + 1,
          divEnd,
        )

        result.push(
          <Node key={getNodeId(node)} node={node} attached={children} />,
        )
        i = nextIndex
        continue
      }
    }

    if (node.data?.target) {
      i++
      continue
    }

    const name = "name" in node.attributes && node.attributes.name
    const attached = name ? contextMap[name] : undefined

    result.push(<Node key={getNodeId(node)} node={node} attached={attached} />)
    i++
  }

  return { result, nextIndex: i }
}

export function renderNodes(nodes: FormNode[]) {
  const contextMap = buildContextMap(nodes)
  const { result } = renderRange(nodes, contextMap, 0)
  return result
}
