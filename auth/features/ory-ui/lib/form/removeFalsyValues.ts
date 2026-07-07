import { isArray, isObject, isString, isNil, isEmpty, transform } from "lodash"

export function removeEmptyStrings<T>(input: T): T {
  if (isArray(input)) {
    const cleaned = input.map((item) => removeEmptyStrings(item))
    return cleaned.filter(
      (item) => !(isString(item) && item === "") && !isNil(item),
    ) as unknown as T
  }

  if (!isObject(input)) {
    return input
  }

  const result = transform(
    input,
    (acc, value, key) => {
      if (isObject(value) && !isArray(value)) {
        const cleaned = removeEmptyStrings(value)
        if (!isEmpty(cleaned)) {
          acc[key] = cleaned
        }
      } else if (isArray(value)) {
        const cleaned = removeEmptyStrings(value)
        if (!isEmpty(cleaned)) {
          acc[key] = cleaned
        }
      } else if (isString(value) && value === "") {
      } else if (!isNil(value)) {
        acc[key] = value
      }
    },
    {} as any,
  )

  return result as T
}
