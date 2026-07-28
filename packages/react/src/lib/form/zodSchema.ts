import { z } from 'zod'
import { UiNode, UiNodeInputAttributes } from '@ory/client-fetch'

import { isUiNodeInput } from '../../types'

const WEBAUTHN_FIELDS = new Set([
  'webauthn_register_displayname',
  'webauthn_remove',
  'webauthn_register',
  'webauthn_login_trigger',
  'passkey_settings_register',
  'passkey_create_data',
  'passkey_challenge',
  'passkey_remove',
])

function buildStringSchema(attrs: UiNodeInputAttributes): z.ZodString {
  let schema = z.string()

  if (attrs.pattern) {
    try {
      schema = schema.regex(new RegExp(attrs.pattern), 'Invalid format')
    } catch {
      // Invalid regex pattern — skip
    }
  }

  if (attrs.maxlength) {
    schema = schema.max(
      attrs.maxlength,
      `Max ${attrs.maxlength} characters`,
    )
  }

  if (attrs.required) {
    schema = schema.min(1, 'Required Input')
  }

  return schema
}

export function buildZodSchema(
  nodes: UiNode[],
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const node of nodes) {
    if (!isUiNodeInput(node)) continue
    const attrs = node.attributes
    const { type, name } = attrs

    if (type === 'hidden') continue
    if (type === 'submit' || type === 'button') continue
    if (name.startsWith('grant_scope')) continue
    if (WEBAUTHN_FIELDS.has(name)) continue

    let schema: z.ZodTypeAny

    if (type === 'checkbox') {
      schema = attrs.required
        ? z.literal(true, { message: 'Required Input' })
        : z.boolean().optional()
    } else {
      if (type === 'number') {
        schema = z.coerce.number()
        if (!attrs.required) {
          schema = schema.optional()
        }
      } else {
        schema = buildStringSchema(attrs)
        if (!attrs.required) {
          schema = schema.optional()
        }
      }
    }

    shape[name] = schema
  }

  return z.object(shape).passthrough()
}
