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
})
