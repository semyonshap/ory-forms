import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeAnchorAttributesNodeTypeEnum,
  UiNodeAttributes,
  UiNodeGroupEnum,
  UiNodeMeta,
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

function createNode({
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

interface CreateAnchorNodeParams extends Omit<
  CreateNodeParams,
  'type' | 'attributes'
> {
  attributes: Omit<UiNodeAnchorAttributes, 'node_type'>
}

export function createAnchorNode({
  attributes,
  ...rest
}: CreateAnchorNodeParams) {
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
