import pluginJs from '@eslint/js';
import eslintPluginImport from 'eslint-plugin-import';
import pathAlias from 'eslint-plugin-path-alias';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import { resolve } from 'node:path'
import tseslint from 'typescript-eslint';

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
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling'],
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'path-alias/no-relative': ['error', {
        paths: {
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
