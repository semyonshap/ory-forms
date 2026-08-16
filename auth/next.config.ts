import type { NextConfig } from 'next'
import dotenv from 'dotenv'
import env from '@/lib/env'

const envfile = env.env_file

if (envfile) {
  dotenv.config({ path: envfile, override: true })
}

const isWindows = process.platform === 'win32'

const nextConfig: NextConfig = {
  output: isWindows ? undefined : 'standalone',
}

export default nextConfig
