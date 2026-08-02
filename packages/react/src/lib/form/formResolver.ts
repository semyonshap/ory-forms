import { z } from 'zod'
import setWith from 'lodash-es/setWith'
import { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
  UiNodeInputAttributesTypeEnum,
} from '@ory/client-fetch'

import { getNodesByGroups, groupNodes } from '../nodes/groups'
import {
  isUiNodeInput,
  FormValues,
  UiNodeInput,
  relationGroups,
} from '../../types'

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
    const { name, type } = node.attributes

    if (
      type === UiNodeInputAttributesTypeEnum.Hidden ||
      type === UiNodeInputAttributesTypeEnum.Button ||
      type === UiNodeInputAttributesTypeEnum.Submit
    )
      continue
    if (name.startsWith('grant_scope')) continue

    setWith(tree, name, buildLeafSchema(node), (val) =>
      isZodLeaf(val) ? {} : val,
    )
  }

  return buildZodObject(tree)
}

export function buildResolverByMethod(
  nodes: UiNode[],
  transientPayload?: FormValues,
): Resolver<FormValues> {
  const { groupsNodes } = groupNodes({ nodes })

  return (values, context, options) => {
    const method = values.method as UiNodeGroupEnum

    const selectedNodes = getNodesByGroups({
      groupsNodes,
      groups: [
        method,
        UiNodeGroupEnum.Captcha,
        ...(relationGroups[method] ?? []),
      ],
    })

    const schema = buildSchema(selectedNodes)

    const resolvedValues: FormValues = { ...values }

    if (transientPayload) {
      for (const node of selectedNodes) {
        if (!isUiNodeInput(node)) continue
        if (!node.data?.transient) continue
        const { name } = node.attributes
        resolvedValues[name] = transientPayload[name]
      }
    }

    return zodResolver(schema)(resolvedValues, context, options)
  }
}
