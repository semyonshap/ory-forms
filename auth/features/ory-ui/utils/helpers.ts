import { isUiNodeInputAttributes, UiContainer, UiNode } from "@ory/client-fetch"

export function getNodeId({ attributes }: UiNode) {
  if (isUiNodeInputAttributes(attributes)) {
    if (attributes.type === "submit" && attributes.value) {
      return `${attributes.name}:${attributes.value}`
    }
    return attributes.name
  } else {
    return attributes.id
  }
}

export function flowHasErrors(ui: UiContainer): boolean {
  if (ui.messages?.some((m) => m.type === "error")) {
    return true
  }
  return ui.nodes.some((node) => node.messages.some((m) => m.type === "error"))
}
