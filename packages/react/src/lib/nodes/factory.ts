import {
  UiNodeAttributes,
  UiNodeDivisionAttributes,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
  UiNodeMeta,
  UiNodeTypeEnum,
  UiText,
  UiTextTypeEnum,
} from '@ory/client-fetch'
import { TFunction } from 'i18next'

import {
  FormNode,
  UiNodeAnchor,
  UiNodeDiv,
  UiNodeText,
  NodeData,
  InputNodeData,
  UiNodeInput,
  DivDataType,
  AnchorNodeData,
} from '../../types'

interface CreateUiNodeParams {
  type: UiNodeTypeEnum
  group?: UiNodeGroupEnum
  messages?: UiText[]
  meta?: UiNodeMeta
  attributes: UiNodeAttributes
  data?: NodeData | InputNodeData
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

interface CreateAnchorNodeParams extends Omit<CreateUiNodeParams, 'type' | 'attributes' | 'data'> {
  id: string
  href: string
  title: UiText
  data?: AnchorNodeData
}

export function createAnchorNode({
  id,
  href,
  title,
  ...rest
}: CreateAnchorNodeParams): UiNodeAnchor {
  const attributes = {
    node_type: 'a' as const,
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

export interface CreateTextNodeParams extends Omit<CreateUiNodeParams, 'type' | 'attributes'> {
  id: string
  text: UiText
}

export function createTextNode({ id, text, ...rest }: CreateTextNodeParams): UiNodeText {
  const attributes = {
    node_type: 'text' as const,
    id,
    text,
  }

  return createUiNode({
    type: UiNodeTypeEnum.Text,
    attributes,
    ...rest,
  }) as UiNodeText
}

interface CreateInputNodeParams extends Omit<CreateUiNodeParams, 'type' | 'attributes'> {
  attributes: Omit<UiNodeInputAttributes, 'node_type'>
  data?: InputNodeData
}

export function createInputNode({
  attributes,
  data,
  ...extra
}: CreateInputNodeParams): UiNodeInput {
  const renderAttributes: UiNodeInputAttributes = {
    ...attributes,
    node_type: 'input',
  }

  return createUiNode({
    type: UiNodeTypeEnum.Input,
    attributes: renderAttributes as UiNodeAttributes,
    data,
    ...extra,
  }) as UiNodeInput
}

interface CreateUiTextParams {
  keyOrId: string | number
  text: string
  type?: UiTextTypeEnum
  context?: object
  t?: TFunction
}

export function createUiText({
  keyOrId,
  text,
  type = UiTextTypeEnum.Info,
  context,
  t,
}: CreateUiTextParams): UiText {
  const isStringKey = typeof keyOrId === 'string'
  const resolvedText =
    isStringKey && t ? t(keyOrId, { defaultValue: text, ...(context || {}) }) : text

  return {
    id: isStringKey ? 0 : keyOrId,
    text: resolvedText,
    type,
    context,
  }
}

interface CreateDivisionNodeParams extends Omit<CreateUiNodeParams, 'type' | 'attributes'> {
  id: string
  class?: string
  div_type?: DivDataType
  div_end?: string
}

export function createDivNode({
  id,
  class: className,
  div_type,
  div_end: end,
  ...rest
}: CreateDivisionNodeParams): UiNodeDiv {
  const data: UiNodeDivisionAttributes['data'] = {}

  if (div_type) data['type'] = div_type
  if (end) data['end'] = end

  const attributes = {
    node_type: 'div' as const,
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
  children,
  div_type,
  ...rest
}: CreateDivisionNodeParams & { children: FormNode[] }): FormNode[] {
  const endId = `${id}-end`

  const startDiv = createDivNode({
    id: `${id}-start`,
    class: className,
    div_type,
    div_end: endId,
    ...rest,
  })

  const endDiv = createDivNode({
    id: endId,
    ...rest,
  })

  return [startDiv, ...children, endDiv]
}
