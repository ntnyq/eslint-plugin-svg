import * as parserSVG from 'svg-eslint-parser'
import { plugin } from '..'
import type { Linter } from 'eslint'
import type { PluginSVG } from '../types/plugin'

function createConfig(
  name: string,
  rules: Linter.RulesRecord,
): Linter.Config<Linter.RulesRecord> {
  return {
    name,
    files: ['**/*.svg'],
    plugins: {
      /* v8 ignore start */
      get svg() {
        return plugin
      },
      /* v8 ignore stop */
    },
    languageOptions: {
      parser: parserSVG,
    },
    rules,
  }
}

/**
 * recommended config preset
 */
export const recommended: Linter.Config<Linter.RulesRecord>[] = [
  createConfig('svg/recommended', {
    'svg/no-deprecated': 'error',
    'svg/no-doctype': 'error',
    'svg/no-duplicate-ids': 'error',
    'svg/no-empty-desc': 'error',
    'svg/no-empty-text': 'error',
    'svg/no-empty-title': 'error',
    'svg/no-invalid-role': 'error',
    'svg/no-script-tags': 'error',
    'svg/require-viewbox': 'error',
  }),
]

/**
 * strict config preset
 */
export const strict: Linter.Config<Linter.RulesRecord>[] = [
  createConfig('svg/strict', {
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
  }),
]

/**
 * security config preset
 */
export const security: Linter.Config<Linter.RulesRecord>[] = [
  createConfig('svg/security', {
    'svg/no-base64-data-url': 'error',
    'svg/no-event-handlers': 'error',
    'svg/no-script-tags': 'error',
  }),
]

/**
 * accessibility config preset
 */
export const a11y: Linter.Config<Linter.RulesRecord>[] = [
  createConfig('svg/a11y', {
    'svg/no-discouraged-role': 'warn',
    'svg/no-empty-desc': 'error',
    'svg/no-empty-text': 'error',
    'svg/no-empty-title': 'error',
    'svg/no-invalid-role': 'error',
  }),
]

export const configs: PluginSVG['configs'] = {
  a11y,
  recommended,
  security,
  strict,
}
