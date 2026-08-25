import { createHash, randomBytes } from 'node:crypto'

const VERIFIER_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'

export function generateCodeVerifier(length = 64): string {
  const bytes = randomBytes(length)
  let result = ''
  for (let i = 0; i < length; i++) {
    result += VERIFIER_CHARS[bytes[i] % VERIFIER_CHARS.length]
  }
  return result
}

export function generateCodeChallenge(codeVerifier: string): string {
  return createHash('sha256').update(codeVerifier).digest('base64url')
}

export function randomString(length = 32): string {
  return randomBytes(length).toString('base64url').slice(0, length)
}

export function createPkcePair(): {
  codeVerifier: string
  codeChallenge: string
} {
  const codeVerifier = generateCodeVerifier()
  return {
    codeVerifier,
    codeChallenge: generateCodeChallenge(codeVerifier),
  }
}
