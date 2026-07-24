import omit from 'lodash-es/omit'
import { omittedInputKeys } from '../types'
import { mapKeys, snakeCase } from 'lodash-es'

export function omitInputAttributes<T extends object>(
  attrs: T,
): Omit<T, (typeof omittedInputKeys)[number]> {
  return omit(attrs, omittedInputKeys) as Omit<T, (typeof omittedInputKeys)[number]>
}

export function normalizeKeys<T extends Record<string, any>>(obj: T): Record<string, T[keyof T]> {
  return mapKeys(obj, (_, key) => snakeCase(key))
}
