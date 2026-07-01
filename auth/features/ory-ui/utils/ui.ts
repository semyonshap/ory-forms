import { isUiNodeInputAttributes, UiNode } from "@ory/client-fetch"

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
