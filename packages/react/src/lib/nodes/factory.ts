import {
  UiNodeAttributes,
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
  NodeDataInput,
  UiNodeInput,
  NodeDataAnchor,
  NodeDataDiv,
  NodeData,
} from '../../types'

interface CreateUiNodeParams {
  type: UiNodeTypeEnum
  group?: UiNodeGroupEnum
  messages?: UiText[]
  meta?: UiNodeMeta
  attributes: UiNodeAttributes
  data?: NodeData
}

function createUiNode({
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
  data?: NodeDataAnchor
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
  data?: NodeDataInput
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
  data?: NodeDataDiv
}

export function createDivNode({
  id,
  class: className,
  data,
  ...rest
}: CreateDivisionNodeParams): UiNodeDiv {
  const attributes = {
    node_type: 'div' as const,
    id,
    _class: className,
  }

  return createUiNode({
    type: UiNodeTypeEnum.Div,
    attributes,
    data,
    ...rest,
  }) as UiNodeDiv
}

export function createDivGroup({
  id,
  class: className,
  children,
  data,
  ...rest
}: CreateDivisionNodeParams & { children: FormNode[] }): FormNode[] {
  const endId = `${id}-end`

  const startDiv = createDivNode({
    id: `${id}-start`,
    class: className,
    data: {
      ...data,
      end: endId,
    },
    ...rest,
  })

  const endDiv = createDivNode({
    id: endId,
    ...rest,
  })

  return [startDiv, ...children, endDiv]
}
