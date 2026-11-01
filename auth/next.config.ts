import type { NextConfig } from 'next'

const isWindows = process.platform === 'win32'

const nextConfig: NextConfig = {
  output: isWindows ? undefined : 'standalone',
}

export default nextConfig
