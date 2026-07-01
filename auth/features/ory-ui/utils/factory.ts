import {
  UiNodeAttributes,
  UiNodeGroupEnum,
  UiNodeMeta,
  UiNodeTypeEnum,
  UiText,
} from "@ory/client-fetch"
import { FormNode } from "../types"

type CreateCustomNodeParams = {
  type: UiNodeTypeEnum
  group?: UiNodeGroupEnum
  attributes?: Partial<UiNodeAttributes>
  messages?: UiText[]
  meta?: Partial<UiNodeMeta>
}

export function createFormNode({
  type,
  group = UiNodeGroupEnum.Default,
  attributes = {},
  messages = [],
  meta = {},
}: CreateCustomNodeParams): FormNode {
  return {
    type,
    group,
    attributes: attributes as UiNodeAttributes,
    messages,
    meta: meta as UiNodeMeta,
  }
}
