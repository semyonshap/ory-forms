function maskSecret(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) return String(value)
  const visible = value.slice(0, 4)
  const hiddenLength = Math.max(value.length - 4, 0)
  return `${visible}${'*'.repeat(hiddenLength)}`
}

export function maskSecretsInObject<T extends Record<string, unknown>>(
  obj: T,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = maskSecretsInObject(value as Record<string, unknown>)
      continue
    }

    const isSecretKey = key.toLowerCase().includes('secret')
    result[key] = isSecretKey ? maskSecret(value) : value
  }

  return result
}
