import * as parserSVG from 'svg-eslint-parser'
import { plugin } from '..'
import type { Linter } from 'eslint'
import type { RulesWithPluginName } from '../dts'

export type CreateConfigOptions = Omit<Linter.Config, 'rules'> & {
  rules?: Partial<RulesWithPluginName>
}

/**
 * Create a ESLint config.
 *
 * @param options - ESLint Linter.Config with type support.
 * @returns ESLint config.
 */
export function createConfig(options: CreateConfigOptions = {}) {
  const config: Linter.Config = {
    ...options,
    files: options.files || ['**/*.svg'],
    plugins: {
      ...(options.plugins || {}),
      /* v8 ignore start */
      get svg() {
        return plugin
      },
      /* v8 ignore stop */
    },
    languageOptions: {
      ...(options.languageOptions || {}),
      parser: parserSVG,
    },
    rules: {
      ...options.rules,
    },
  }
  return config
}

/**
 * recommended config preset
 */
export const recommended = [
  createConfig({
    name: 'svg/recommended',
    // @keep-sorted
    rules: {
      'svg/no-empty-desc': 'error',
      'svg/no-empty-text': 'error',
      'svg/no-empty-title': 'error',
    },
  }),
]

export const configs = {
  recommended,
}
