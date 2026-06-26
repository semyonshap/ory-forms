import { isUiNodeInputAttributes, UiNode } from "@ory/client-fetch"
import { RenderNode, UiNodeEnhanced } from "../types"
import { resolveDividers } from "./resolveDividers"
import { resolveHeader } from "./resolveHeader"

function resolveVisible(node: UiNode): boolean {
  return true
}

function resolveDefaultValue(node: UiNode): string | number | undefined {
  if (isUiNodeInputAttributes(node.attributes)) {
    const { type, value } = node.attributes
    if (type !== "button" && type !== "submit") {
      return value
    }
  }
  return undefined
}

function resolveIcon(node: UiNode): string | undefined {
  if (!isUiNodeInputAttributes(node.attributes)) {
    return undefined
  }

  const { name, type, value } = node.attributes

  if (
    (node.group === "oidc" || node.group === "saml") &&
    type === "submit" &&
    name === "provider"
  ) {
    const provider = typeof value === "string" ? value.split("-")[0] : undefined
    return provider
  }

  return undefined
}

export function resolveNode(node: UiNode): UiNodeEnhanced {
  return {
    ...node,
    kind: "ory",
    ui: {
      visible: resolveVisible(node),
      defaultValue: resolveDefaultValue(node),
      icon: resolveIcon(node),
    },
  }
}

export function buildNodes(nodes: UiNode[]): RenderNode[] {
  const result = nodes.map(resolveNode)
  const headerNode = resolveHeader(
    result,
    flowType,
    flow,
    formState,
    container,
  )
  if (headerNode) {
    result.push(headerNode)
  }
  return resolveDividers(result)
}
