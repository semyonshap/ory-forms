import { isArray, isObject, isString, isNil, isEmpty } from 'lodash-es'

export function removeEmptyStrings<T>(input: T): T {
  if (isArray(input)) {
    const cleaned = input.map((item) => removeEmptyStrings(item))
    return cleaned.filter((item) => !(isString(item) && item === '') && !isNil(item)) as T
  }

  if (!isObject(input)) {
    return input
  }

  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(input)) {
    if (isObject(value) && !isArray(value)) {
      const cleaned = removeEmptyStrings(value)
      if (!isEmpty(cleaned)) {
        result[key] = cleaned
      }
      continue
    }

    if (isArray(value)) {
      const cleaned = removeEmptyStrings(value)
      if (!isEmpty(cleaned)) {
        result[key] = cleaned
      }
      continue
    }

    if (isString(value) && value === '') {
      continue
    }

    if (isNil(value)) {
      continue
    }

    result[key] = value
  }

  return result as T
}
