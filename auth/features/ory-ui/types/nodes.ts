import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeDivisionAttributes,
  UiNodeGroupEnum,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeScriptAttributes,
  UiNodeTextAttributes,
} from "@ory/client-fetch"

export type GroupedNodes = Partial<Record<UiNodeGroupEnum, UiNode[]>>

export type FormNodeLayout = {
  section?: "default" | "footer"
  group?: "default" | "method" | "sso"
  inline?: boolean
}

export type FormNode = UiNode & {
  layout?: FormNodeLayout
}

export type UiNodeInput = FormNode & {
  type: "input"
  attributes: UiNodeInputAttributes
}

export function isUiNodeInput(node: FormNode): node is UiNodeInput {
  return node.type === "input"
}

export type UiNodeImage = FormNode & {
  type: "img"
  attributes: UiNodeImageAttributes
}

export function isUiNodeImage(node: FormNode): node is UiNodeImage {
  return node.type === "img"
}

export type UiNodeAnchor = FormNode & {
  type: "a"
  attributes: UiNodeAnchorAttributes
}

export function isUiNodeAnchor(node: FormNode): node is UiNodeAnchor {
  return node.type === "a"
}

export type UiNodeText = FormNode & {
  type: "text"
  attributes: UiNodeTextAttributes
}

export function isUiNodeText(node: FormNode): node is UiNodeText {
  return node.type === "text"
}

export type UiNodeScript = FormNode & {
  type: "script"
  attributes: UiNodeScriptAttributes
}
export function isUiNodeScript(node: FormNode): node is UiNodeScript {
  return node.type === "script"
}

export type UiNodeDiv = FormNode & {
  type: "div"
  attributes: UiNodeDivisionAttributes
}

export function isUiNodeDiv(node: FormNode): node is UiNodeDiv {
  return node.type === "div"
}

export type UiNodeFixed =
  | UiNodeInput
  | UiNodeImage
  | UiNodeAnchor
  | UiNodeText
  | UiNodeScript
  | UiNodeDiv
