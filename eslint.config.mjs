// @ts-check

import { defineESLintConfig } from '@ntnyq/eslint-config'

export default defineESLintConfig({
  svgo: true,
  eslintPlugin: {
    overrides: {
      'eslint-plugin/require-meta-default-options': 'off',
      'eslint-plugin/require-meta-languages': 'off',
    },
  },
  test: {
    vitest: {
      overrides: {
        'vitest/no-standalone-expect': 'off',
      },
    },
  },
})
