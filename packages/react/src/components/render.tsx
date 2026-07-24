import { ReactNode } from 'react'

import { getNodeId } from '../lib'
import { FormContext, FormNode, isUiNodeDiv } from '../types'

import { Node } from './node'

export interface OutputNode {
  node: FormNode
  element: ReactNode
}

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
): { result: OutputNode[]; nextIndex: number } {
  const result: OutputNode[] = []
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
        const { result: children, nextIndex } = renderRange(nodes, contextMap, i + 1, divEnd)

        result.push({
          node,
          element: (
            <Node key={getNodeId(node)} node={node} attached={children.map((c) => c.element)} />
          ),
        })
        i = nextIndex
        continue
      }
    }

    if (node.data?.target) {
      i++
      continue
    }

    const name = 'name' in node.attributes && node.attributes.name
    const attached = name ? contextMap[name] : undefined

    result.push({
      node,
      element: <Node key={getNodeId(node)} node={node} attached={attached} />,
    })
    i++
  }

  return { result, nextIndex: i }
}

export function renderNodes(nodes: FormNode[]): OutputNode[] {
  const contextMap = buildContextMap(nodes)
  const { result } = renderRange(nodes, contextMap, 0)
  return result
}
