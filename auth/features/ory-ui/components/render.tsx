import { ReactNode } from "react"

import { Node } from "./node"
import { getNodeId } from "../utils"
import { NodeDiv } from "./nodes/div"
import { FormContext, FormNode, isUiNodeDiv, UiNodeDiv } from "../types"

function isDivRole(node: FormNode, role: "start" | "end"): node is UiNodeDiv {
  return isUiNodeDiv(node) && node.attributes.data?.role === role
}

function renderNode(node: FormNode, context?: FormContext) {
  return <Node key={getNodeId(node)} node={node} context={context} />
}

export function buildFormContext(nodes: FormNode[]): FormContext {
  const formContext: FormContext = {}
  for (const node of nodes) {
    const target = node.data?.target
    if (!target) continue
    if (!formContext[target]) formContext[target] = []
    formContext[target].push(<Node key={getNodeId(node)} node={node} />)
  }
  return formContext
}

export function renderNodes(
  nodes: FormNode[],
  start: number = 0,
  contextMap: FormContext = {},
) {
  const result: ReactNode[] = []
  let i = start

  while (i < nodes.length) {
    const node = nodes[i]

    if (isDivRole(node, "end")) {
      return { result, nextIndex: i + 1 }
    }

    if (isDivRole(node, "start")) {
      const { result: children, nextIndex } = renderNodes(nodes, i + 1)
      result.push(NodeDiv(node, children))
      i = nextIndex
      continue
    }

    const renderedNode = renderNode(node)

    if (node.data?.target) {
      const key = node.data.target
      if (!contextMap[key]) contextMap[key] = []
      contextMap[key].push(renderedNode)
      i++
      continue
    }

    result.push(renderedNode)
    i++
  }

  return { result, nextIndex: i, contextMap }
}
