import {
  UiNodeAttributes,
  UiNodeGroupEnum,
  UiNodeMeta,
  UiNodeTextAttributes,
  UiNodeTypeEnum,
  UiText,
  UiTextTypeEnum,
} from "@ory/client-fetch"
import {
  CustomMessageKey,
  custonMessageIds,
  FormNode,
  FormNodeLayout,
  UiNodeAnchor,
  UiNodeText,
} from "../types"

interface CreateUiNodeParams {
  type: UiNodeTypeEnum
  group?: UiNodeGroupEnum
  messages?: Array<UiText>
  meta?: UiNodeMeta
  attributes: UiNodeAttributes
  layout?: FormNodeLayout
}

export function createUiNode({
  type,
  group = UiNodeGroupEnum.Default,
  messages = [],
  meta = {},
  attributes,
  layout,
}: CreateUiNodeParams): FormNode {
  return {
    attributes,
    group,
    type,
    messages,
    meta,
    layout,
  }
}

interface CreateAnchorNodeParams extends Omit<
  CreateUiNodeParams,
  "type" | "attributes"
> {
  id: string
  href: string
  title: UiText
}

export function createAnchorNode({
  id,
  href,
  title,
  ...rest
}: CreateAnchorNodeParams): UiNodeAnchor {
  const attributes = {
    node_type: "a" as const,
    id,
    href,
    title,
  }

  return createUiNode({
    type: UiNodeTypeEnum.A,
    attributes,
    ...rest,
  }) as UiNodeAnchor
}

export interface CreateTextNodeParams extends Omit<
  CreateUiNodeParams,
  "type" | "attributes"
> {
  id: string
  text: UiText
}

export function createTextNode({
  id,
  text,
  ...rest
}: CreateTextNodeParams): UiNodeText {
  const attributes = {
    node_type: "text" as const,
    id,
    text,
  }

  return createUiNode({
    type: UiNodeTypeEnum.Text,
    attributes,
    ...rest,
  }) as UiNodeText
}

interface CreateUiTextParams {
  keyOrId: CustomMessageKey | number
  fallback: string
  type?: UiTextTypeEnum
  context?: object
}

export function createUiText({
  keyOrId,
  fallback,
  type = UiTextTypeEnum.Info,
  context,
}: CreateUiTextParams): UiText {
  const id = typeof keyOrId === "number" ? keyOrId : custonMessageIds[keyOrId]

  return {
    id,
    text: fallback,
    type,
    context,
  }
}
