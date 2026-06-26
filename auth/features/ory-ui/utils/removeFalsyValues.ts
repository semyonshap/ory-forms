type AnyObject = Record<string, unknown>

export function removeEmptyStrings<T>(input: T): T {
  if (Array.isArray(input)) {
    return (
      input
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .map((item) => removeEmptyStrings(item))
        .filter(
          (v) => v || typeof v === "boolean" || typeof v === "number",
        ) as unknown as T
    )
  }

  if (input === null || typeof input !== "object") {
    return input
  }

  const obj = input as AnyObject
  const out: AnyObject = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object") {
      const cleaned = removeEmptyStrings(value)
      if (Array.isArray(cleaned)) {
        if (cleaned.length) {
          out[key] = cleaned
        }
      } else if (cleaned && Object.keys(cleaned as AnyObject).length > 0) {
        out[key] = cleaned
      }
    } else if (
      value ||
      typeof value === "boolean" ||
      typeof value === "number"
    ) {
      out[key] = value
    }
  }

  return out as T
}
