import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import nextPlugin from '@next/eslint-plugin-next'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import perfectionist from 'eslint-plugin-perfectionist'
import { defineConfig } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier'

const base = defineConfig(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/coverage/**',
      '**/next-env.d.ts',
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      perfectionist,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      'perfectionist/sort-imports': [
        'warn',
        {
          type: 'line-length',
          order: 'asc',
          groups: [
            'type',
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
            'side-effect',
            'style',
          ],
          newlinesBetween: 1,
          internalPattern: ['^@ory-forms/', '^@/'],
        },
      ],
    },
  },
  nextPlugin.flatConfig.coreWebVitals,
  prettierConfig,
)

export default base
