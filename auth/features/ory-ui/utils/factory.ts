import {
  UiNodeAttributes,
  UiNodeGroupEnum,
  UiNodeMeta,
  UiNodeTypeEnum,
  UiText,
  UiTextTypeEnum,
} from "@ory/client-fetch"
import {
  FormNode,
  UiNodeAnchor,
  UiNodeDiv,
  UiNodeText,
  NodeData,
} from "../types"
import { TFunction } from "i18next"

interface CreateUiNodeParams {
  type: UiNodeTypeEnum
  group?: UiNodeGroupEnum
  messages?: Array<UiText>
  meta?: UiNodeMeta
  attributes: UiNodeAttributes
  data?: NodeData
}

export function createUiNode({
  type,
  group = UiNodeGroupEnum.Default,
  messages = [],
  meta = {},
  attributes,
  data,
}: CreateUiNodeParams): FormNode {
  return {
    attributes,
    group,
    type,
    messages,
    meta,
    data,
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
  keyOrId: string | number
  text: string
  type?: UiTextTypeEnum
  context?: object
  t: TFunction
}

export function createUiText({
  keyOrId,
  text,
  type = UiTextTypeEnum.Info,
  context,
  t,
}: CreateUiTextParams): UiText {
  if (typeof keyOrId === "string") {
    return {
      id: 0,
      text: t(keyOrId, { defaultValue: text, ...(context || {}) }),
      type,
      context,
    }
  }

  return {
    id: keyOrId,
    text: text,
    type,
    context,
  }
}

interface CreateDivisionNodeParams extends Omit<
  CreateUiNodeParams,
  "type" | "attributes"
> {
  id: string
  class?: string
  data?: Record<string, string>
}

export function createDivNode({
  id,
  class: className,
  data,
  ...rest
}: CreateDivisionNodeParams): UiNodeDiv {
  const attributes = {
    node_type: "div" as const,
    id,
    _class: className,
    data,
  }

  return createUiNode({
    type: UiNodeTypeEnum.Div,
    attributes,
    ...rest,
  }) as UiNodeDiv
}

export function createDivGroup({
  id,
  class: className,
  data,
  children,
  ...rest
}: CreateDivisionNodeParams & { children: FormNode[] }): FormNode[] {
  const startDiv = createDivNode({
    id: `${id}-start`,
    class: className,
    data: { ...data, role: "start" },
    ...rest,
  })

  const endDiv = createDivNode({
    id: `${id}-end`,
    data: { ...data, role: "end" },
  })

  return [startDiv, ...children, endDiv]
}
