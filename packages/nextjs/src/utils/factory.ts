import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeAnchorAttributesNodeTypeEnum,
  UiNodeAttributes,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
  UiNodeMeta,
  UiNodeTextAttributes,
  UiNodeTypeEnum,
  UiText,
  UiTextTypeEnum,
} from '@ory/client-fetch'

interface CreateNodeParams {
  type: UiNodeTypeEnum
  attributes: UiNodeAttributes
  messages?: UiText[]
  group?: UiNodeGroupEnum
  meta?: UiNodeMeta
}

export function createNode({
  type,
  attributes,
  meta = {},
  messages = [],
  group = UiNodeGroupEnum.Default,
}: CreateNodeParams): UiNode {
  return {
    attributes,
    group,
    type,
    messages,
    meta,
  }
}

interface CreateInputNodeParams extends Omit<CreateNodeParams, 'type' | 'attributes'> {
  attributes: Omit<UiNodeInputAttributes, 'node_type' | 'disabled'> & {
    disabled?: boolean
  }
}

export function createInputNode({ attributes, ...extra }: CreateInputNodeParams) {
  return createNode({
    attributes: {
      ...attributes,
      disabled: attributes.disabled ?? false,
      node_type: 'input',
    },
    type: UiNodeTypeEnum.Input,
    ...extra,
  })
}

interface CreateAnchorNodeParams extends Omit<CreateNodeParams, 'type' | 'attributes'> {
  attributes: Omit<UiNodeAnchorAttributes, 'node_type'>
}

export function createAnchorNode({ attributes, ...rest }: CreateAnchorNodeParams) {
  return createNode({
    type: UiNodeTypeEnum.A,
    attributes: {
      ...attributes,
      node_type: UiNodeAnchorAttributesNodeTypeEnum.A,
    },
    ...rest,
  })
}

interface CreateUiTextParams {
  id: number
  text: string
  type?: UiTextTypeEnum
  context?: object
}

export function createUiText({
  id,
  text,
  type = UiTextTypeEnum.Info,
  context,
}: CreateUiTextParams): UiText {
  return {
    id,
    text,
    type,
    context,
  }
}

interface CreateTextNodeParams extends Omit<CreateNodeParams, 'type' | 'attributes'> {
  attributes: Omit<UiNodeTextAttributes, 'node_type'>
}

export function createTextNode({ attributes, ...extra }: CreateTextNodeParams) {
  return createNode({
    attributes: {
      ...attributes,
      node_type: 'text',
    },
    type: UiNodeTypeEnum.Text,
    ...extra,
  })
}
