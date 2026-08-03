import { defineConfig } from 'tsdown'
import strip from '@rollup/plugin-strip'

const isDev = process.argv.includes('--watch')

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  sourcemap: true,
  dts: true,
  unbundle: true,
  deps: {
    neverBundle: [
      'react',
      'react-dom',
      '@ory/client-fetch',
      'react-hook-form',
      'react-i18next',
      'i18next',
      'zustand',
      'lodash-es',
      'usehooks-ts',
    ],
  },
  plugins: isDev
    ? []
    : [
        strip({
          include: ['**/*.{ts,tsx}'],
          exclude: ['node_modules/**'],
        }),
      ],
})
