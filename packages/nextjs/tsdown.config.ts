import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  sourcemap: true,
  dts: true,
  unbundle: true,
  deps: {
    neverBundle: [
      'next',
      '@ory/client-fetch',
      '@ory-forms/react',
      'cookie-es',
      'tldts',
      'lodash-es',
    ],
  },
})
