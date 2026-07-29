import { z } from 'zod'
import {
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
  UiNodeInputAttributesTypeEnum,
} from '@ory/client-fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import { Resolver } from 'react-hook-form'

import { isUiNodeInput, FormValues, UiNodeInput } from '../../types'
import { getNodesByGroups, groupNodes } from '../nodes/groups'

const ALLOWED_INPUTS = new Set<UiNodeInputAttributesTypeEnum>([
  UiNodeInputAttributesTypeEnum.Checkbox,
  UiNodeInputAttributesTypeEnum.Email,
  UiNodeInputAttributesTypeEnum.Number,
  UiNodeInputAttributesTypeEnum.Password,
  UiNodeInputAttributesTypeEnum.Tel,
  UiNodeInputAttributesTypeEnum.Text,
  UiNodeInputAttributesTypeEnum.Url,
  UiNodeInputAttributesTypeEnum.Date,
  UiNodeInputAttributesTypeEnum.DatetimeLocal,
])

const EXPAND_GROUPS: Partial<Record<UiNodeGroupEnum, UiNodeGroupEnum[]>> =
  {
    [UiNodeGroupEnum.Password]: [
      UiNodeGroupEnum.Default,
      UiNodeGroupEnum.Profile,
    ],
  }

type LeafValue = Exclude<FormValues[string], FormValues>

interface ShapeTree {
  [key: string]: z.ZodType<LeafValue, LeafValue> | ShapeTree
}

function isZodLeaf(
  value: z.ZodType<LeafValue, LeafValue> | ShapeTree,
): value is z.ZodType<LeafValue, LeafValue> {
  return value instanceof z.ZodType
}

function buildStringSchema(
  attrs: UiNodeInputAttributes,
): z.ZodType<string, string> {
  let schema = z.string()

  const { name, pattern, maxlength, required } = attrs

  if (pattern) {
    try {
      schema = schema.regex(new RegExp(pattern), `Invalid ${name} format`)
    } catch {
      // Invalid regex pattern — skip
    }
  }

  if (maxlength) {
    schema = schema.max(maxlength, `Max ${maxlength} characters`)
  }

  if (required) {
    schema = schema.min(1, `Required ${name}`)
  }

  return schema
}

function buildLeafSchema(
  node: UiNodeInput,
): z.ZodType<LeafValue, LeafValue> {
  const attr = node.attributes
  const { type, required } = attr

  switch (type) {
    case UiNodeInputAttributesTypeEnum.Checkbox: {
      return required
        ? z.literal(true, { message: 'Required Input' })
        : z.boolean().optional()
    }
    case UiNodeInputAttributesTypeEnum.Number: {
      const s = z.coerce.number<number>()
      return required ? s : s.optional()
    }
    default: {
      return buildStringSchema(attr)
    }
  }
}

function setNestedSchema(
  tree: ShapeTree,
  path: string[],
  schema: z.ZodType<LeafValue, LeafValue>,
) {
  let current = tree

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    const existing = current[key]

    if (!existing || isZodLeaf(existing)) {
      current[key] = {}
    }
    current = current[key] as ShapeTree
  }

  current[path[path.length - 1]] = schema
}

function buildZodObject(
  tree: ShapeTree,
): z.ZodType<FormValues, FormValues> {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const key of Object.keys(tree)) {
    const value = tree[key]
    shape[key] = isZodLeaf(value) ? value : buildZodObject(value)
  }

  return z.looseObject(shape) as z.ZodType<FormValues, FormValues>
}

function buildSchema(nodes: UiNode[]): z.ZodType<FormValues, FormValues> {
  const tree: ShapeTree = {}

  for (const node of nodes) {
    if (!isUiNodeInput(node)) continue
    const { type, name } = node.attributes

    if (!ALLOWED_INPUTS.has(type)) continue
    if (name.startsWith('grant_scope')) continue

    setNestedSchema(tree, name.split('.'), buildLeafSchema(node))
  }

  return buildZodObject(tree)
}

export function buildResolverByMethod(
  nodes: UiNode[],
): Resolver<FormValues> {
  const { groupsNodes } = groupNodes({
    nodes,
    excludeScripts: true,
    excludeHidden: true,
  })

  return (values, context, options) => {
    const method = values.method as UiNodeGroupEnum

    const selectedNodes = getNodesByGroups({
      groupsNodes,
      groups: [method, ...(EXPAND_GROUPS[method] ?? [])],
    })

    const schema = buildSchema(selectedNodes)

    return zodResolver(schema)(values, context, options)
  }
}
