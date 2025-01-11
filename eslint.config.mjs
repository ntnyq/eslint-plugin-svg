// @ts-check

import { defineESLintConfig } from '@ntnyq/eslint-config'

export default defineESLintConfig({
  ignores: ['**/tests/fixtures'],
  eslintPlugin: {
    overrides: {
      'eslint-plugin/require-meta-default-options': 'off',
    },
  },
})
