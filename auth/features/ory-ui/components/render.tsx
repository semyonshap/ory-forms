import { ReactNode } from "react"

import { Node } from "./node"
import { getNodeId } from "../utils"
import { NodeDiv } from "./nodes/div"
import { FormContext, FormNode, isUiNodeDiv, UiNodeDiv } from "../types"

function isDivRole(node: FormNode, role: "start" | "end"): node is UiNodeDiv {
  return isUiNodeDiv(node) && node.attributes.data?.role === role
}

export function buildContextMap(nodes: FormNode[]): FormContext {
  const contextMap: FormContext = {}

  for (const node of nodes) {
    const target = node.data?.target
    if (!target) continue

    if (!contextMap[target]) contextMap[target] = []
    contextMap[target].push(<Node key={getNodeId(node)} node={node} />)
  }

  return contextMap
}

function renderRange(
  nodes: FormNode[],
  contextMap: FormContext,
  start: number,
): { result: ReactNode[]; nextIndex: number } {
  const result: ReactNode[] = []
  let i = start

  while (i < nodes.length) {
    const node = nodes[i]

    if (isDivRole(node, "end")) {
      return { result, nextIndex: i + 1 }
    }

    if (isDivRole(node, "start")) {
      const { result: children, nextIndex } = renderRange(
        nodes,
        contextMap,
        i + 1,
      )
      result.push(NodeDiv(node, children))
      i = nextIndex
      continue
    }

    if (node.data?.target) {
      i++
      continue
    }

    const name =
      node.attributes && "name" in node.attributes && node.attributes.name

    const attached = name && contextMap[name]

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
