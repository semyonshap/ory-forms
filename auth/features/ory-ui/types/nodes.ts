import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeDivisionAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeScriptAttributes,
  UiNodeTextAttributes,
} from "@ory/client-fetch"

export type UiNodeInputAttributesOption = {
  value: unknown
}

export type UiNodeInputAttributesWithOptions = UiNodeInputAttributes & {
  options?: UiNodeInputAttributesOption[]
}

export type UiNodeInput = UiNode & {
  type: "input"
  attributes: UiNodeInputAttributesWithOptions
}
export function isUiNodeInput(node: UiNode): node is UiNodeInput {
  return node.type === "input"
}

export type UiNodeImage = UiNode & {
  type: "img"
  attributes: UiNodeImageAttributes
}
export function isUiNodeImage(node: UiNode): node is UiNodeImage {
  return node.type === "img"
}

export type UiNodeAnchor = UiNode & {
  type: "a"
  attributes: UiNodeAnchorAttributes
}
export function isUiNodeAnchor(node: UiNode): node is UiNodeAnchor {
  return node.type === "a"
}

export type UiNodeText = UiNode & {
  type: "text"
  attributes: UiNodeTextAttributes
}
export function isUiNodeText(node: UiNode): node is UiNodeText {
  return node.type === "text"
}

export type UiNodeScript = UiNode & {
  type: "script"
  attributes: UiNodeScriptAttributes
}
export function isUiNodeScript(node: UiNode): node is UiNodeScript {
  return node.type === "script"
}

export type UiNodeDiv = UiNode & {
  type: "div"
  attributes: UiNodeDivisionAttributes
}
export function isUiNodeDiv(node: UiNode): node is UiNodeDiv {
  return node.type === "div"
}

export type UiNodeFixed =
  | UiNodeInput
  | UiNodeImage
  | UiNodeAnchor
  | UiNodeText
  | UiNodeScript
  | UiNodeDiv
