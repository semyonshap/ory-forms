import { mapKeys, snakeCase, omit } from 'lodash-es'

import { omittedInputKeys } from '../types'

export function omitInputAttributes<T extends object>(
  attrs: T,
): Omit<T, (typeof omittedInputKeys)[number]> {
  return omit(attrs, omittedInputKeys) as Omit<T, (typeof omittedInputKeys)[number]>
}

export function normalizeKeys<T extends Record<string, unknown>>(
  obj: T,
): Record<string, T[keyof T]> {
  return mapKeys(obj, (_, key) => snakeCase(key))
}
