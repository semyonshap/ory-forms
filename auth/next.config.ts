import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    resolveAlias: {
      'node:fs': 'fs',
      'node:fs/promises': 'fs/promises',
      'node:module': 'module',
      'node:os': 'os',
      'node:path': 'path',
      'node:util': 'util',
    },
  },
}

export default nextConfig
