import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeDivisionAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeScriptAttributes,
  UiNodeTextAttributes,
} from '@ory/client-fetch'

import { VariantsAnchor, TypeDiv, VariantsDiv, VariantsInput } from '.'

export interface NodeDataAnchor {
  variant?: VariantsAnchor
  target?: string
}

export interface NodeDataInput {
  variant?: VariantsInput
  onClick?: () => void
  description?: string
  readOnly?: boolean
  target?: string
}

export interface NodeDataDiv {
  variant?: VariantsDiv
  type?: TypeDiv
  end?: string
  target?: string
}

export type NodeData = NodeDataDiv | NodeDataInput | NodeDataAnchor

export type FormNode = UiNode & {
  data?: NodeData
}

export type UiNodeInput = FormNode & {
  type: 'input'
  attributes: UiNodeInputAttributes
  data?: NodeDataInput
}

export type UiNodeImage = FormNode & {
  type: 'img'
  attributes: UiNodeImageAttributes
}

export type UiNodeAnchor = FormNode & {
  type: 'a'
  attributes: UiNodeAnchorAttributes
  data?: NodeDataAnchor
}

export type UiNodeText = FormNode & {
  type: 'text'
  attributes: UiNodeTextAttributes
}

export type UiNodeDiv = FormNode & {
  type: 'div'
  attributes: UiNodeDivisionAttributes
  data?: NodeDataDiv
}

export type UiNodeScript = FormNode & {
  type: 'script'
  attributes: UiNodeScriptAttributes
}

export function isUiNodeInput(node: FormNode): node is UiNodeInput {
  return node.type === 'input'
}

export function isUiNodeImage(node: FormNode): node is UiNodeImage {
  return node.type === 'img'
}

export function isUiNodeAnchor(node: FormNode): node is UiNodeAnchor {
  return node.type === 'a'
}

export function isUiNodeText(node: FormNode): node is UiNodeText {
  return node.type === 'text'
}

export function isUiNodeScript(node: FormNode): node is UiNodeScript {
  return node.type === 'script'
}

export function isUiNodeDiv(node: FormNode): node is UiNodeDiv {
  return node.type === 'div'
}
