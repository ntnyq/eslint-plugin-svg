import * as parserSVG from 'svg-eslint-parser'
import { plugin } from '..'
import type { Linter } from 'eslint'
import type { PluginSVG } from '../types/plugin'

/**
 * recommended config preset
 */
export const recommended: Linter.Config<Linter.RulesRecord>[] = [
  {
    name: 'svg/recommended',
    files: ['**/*.svg'],
    plugins: {
      /* v8 ignore start */
      // @ts-expect-error types
      get svg() {
        return plugin
      },
      /* v8 ignore stop */
    },
    languageOptions: {
      parser: parserSVG,
    },
    // @keep-sorted
    rules: {
      'svg/no-deprecated': 'error',
      'svg/no-doctype': 'error',
      'svg/no-duplicate-ids': 'error',
      'svg/no-empty-container': 'error',
      'svg/no-empty-desc': 'error',
      'svg/no-empty-groups': 'error',
      'svg/no-empty-text': 'error',
      'svg/no-empty-title': 'error',
      'svg/no-event-handlers': 'error',
      'svg/no-inline-styles': 'error',
      'svg/no-invalid-role': 'error',
      'svg/no-script-tags': 'error',
      'svg/require-viewbox': 'error',
    },
  },
]

export const configs: PluginSVG['configs'] = {
  recommended,
}
