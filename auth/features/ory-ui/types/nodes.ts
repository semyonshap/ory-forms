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
import { InputDataType } from "./render"

export type GroupedNodes = Partial<Record<UiNodeGroupEnum, UiNode[]>>

export type ButtonNodeType = "method" | "resend"

export type NodeData = {
  type?: ButtonNodeType
  target?: string
}

export type InputNodeData = NodeData & {
  inputType?: InputDataType
  onClick?: () => void
  description?: string
}

export type FormNode = UiNode & {
  data?: NodeData
}

export type UiNodeInput = FormNode & {
  type: "input"
  attributes: UiNodeInputAttributes
  data?: InputNodeData
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

export type DivDataType = "Div" | "FormCard" | "SettingsCard" | "DividerCard"

export type DivAttributesData = {
  type?: DivDataType
  end?: string
}

export type UiNodeDiv = FormNode & {
  type: "div"
  attributes: UiNodeDivisionAttributes & {
    data?: DivAttributesData
  }
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
