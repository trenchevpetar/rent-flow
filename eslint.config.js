import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import eslintPluginImport from 'eslint-plugin-import';
import pathAlias from 'eslint-plugin-path-alias';
import { resolve } from 'node:path'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { ignores: ['dist'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/strongly-recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    rules: {
      'space-before-function-paren': ['error', 'always'],
      'quotes': ['error', 'single'],
      'object-curly-spacing': ['error', 'always'],
      'import/no-unresolved': [
        'error',
        {
          ignore: ['^@/'],
        },
      ],
      'import/no-named-as-default': 'warn',
      'import/order': [
        'error',
        {
          groups: [
            // Group built-in modules first
            ['builtin', 'external'],
            // Then group internal modules
            ['internal', 'parent', 'sibling'],
          ],
          'newlines-between': 'always', // Enforce a newline between each group
          alphabetize: {
            order: 'asc', // Alphabetize imports within each group
            caseInsensitive: true,
          },
        },
      ],
      'path-alias/no-relative': ['error', {
        paths: {
          // It's recommended to resolve path alias directories as
          // relative paths will be resolved relative to cwd. This
          // may cause unexpected behavior in monorepo setups
          '@': resolve(import.meta.dirname, './src'),
        },
      }],
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    plugins: {
      import: eslintPluginImport,
      'path-alias': pathAlias,
    }
  },
];
