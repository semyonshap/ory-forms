import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeDivisionAttributes,
  UiNodeGroupEnum,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeInputAttributesTypeEnum,
  UiNodeScriptAttributes,
  UiNodeTextAttributes,
} from "@ory/client-fetch"
import {
  FormAnchorProps,
  FormImageProps,
  FormInputProps,
  FormInputButtonProps,
  FormInputHiddenProps,
  FormOptionsInput,
  FormOptionsButton,
  FormOptionsAuthMethodButton,
} from "./renderProps"

export type GroupedNodes = Partial<Record<UiNodeGroupEnum, UiNode[]>>

export type FormNode = UiNode & {
  subtype?: string
}

export type UiNodeInput = UiNode & {
  type: "input"
  subtype?: "authmethod" | "sso"
  attributes: UiNodeInputAttributes
  props: FormInputProps
  options: FormOptionsInput
}

export function isUiNodeInput(node: FormNode): node is UiNodeInput {
  return node.type === "input"
}

export type UiNodeInputButton = UiNode & {
  type: "input"
  attributes: UiNodeInputAttributes & {
    type: typeof UiNodeInputAttributesTypeEnum.Button
  }
  props: FormInputButtonProps
  options: FormOptionsButton
}

export function isUiNodeInputButton(node: FormNode): node is UiNodeInputButton {
  return (
    node.type === "input" &&
    "attributes" in node &&
    "type" in node.attributes &&
    node.attributes.type === UiNodeInputAttributesTypeEnum.Button
  )
}

export type UiNodeInputHidden = UiNode & {
  type: "input"
  attributes: UiNodeInputAttributes & {
    type: typeof UiNodeInputAttributesTypeEnum.Hidden
  }
  props: FormInputHiddenProps
}

export function isUiNodeInputHidden(node: FormNode): node is UiNodeInputHidden {
  return (
    node.type === "input" &&
    "attributes" in node &&
    "type" in node.attributes &&
    node.attributes.type === UiNodeInputAttributesTypeEnum.Hidden
  )
}

export type UiNodeAuthMethodInput = UiNodeInputButton & {
  subtype: "authmethod"
  props: FormInputButtonProps
  options: FormOptionsAuthMethodButton
}

export function isUiNodeAuthMethodInput(
  node: FormNode,
): node is UiNodeAuthMethodInput {
  return node.type === "input" && node.subtype === "authmethod"
}

export type UiNodeImage = FormNode & {
  type: "img"
  attributes: UiNodeImageAttributes
  props: FormImageProps
}

export function isUiNodeImage(node: FormNode): node is UiNodeImage {
  return node.type === "img"
}

export type UiNodeAnchor = FormNode & {
  type: "a"
  attributes: UiNodeAnchorAttributes
  props: FormAnchorProps
  options: FormOptionsInput
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
  subtype?: "divider"
  attributes: UiNodeDivisionAttributes
}

export function isUiNodeDiv(node: FormNode): node is UiNodeDiv {
  return node.type === "div" && node.subtype === undefined
}

export type UiNodeDivider = UiNodeDiv & {
  subtype: "divider"
}

export function isUiNodeDivider(node: FormNode): node is UiNodeDivider {
  return node.type === "div" && node.subtype == "divider"
}

export type UiNodeFixed =
  | UiNodeInput
  | UiNodeImage
  | UiNodeAnchor
  | UiNodeText
  | UiNodeScript
  | UiNodeDiv
  | UiNodeDivider
