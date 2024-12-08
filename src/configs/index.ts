import { plugin } from '..'
import type { Linter } from 'eslint'
import type { RulesWithPluginName } from '../dts'

export interface RecommendedOptions extends Linter.Config {
  /**
   * Overrides rules.
   */
  overridesRules?: RulesWithPluginName
}

/**
 * Create recommended config in flat style.
 *
 * @param options - Create recommended config {@link RecommendedOptions}.
 * @returns flat recommended config.
 */
export function createRecommendedConfig(options: RecommendedOptions = {}) {
  const config: Linter.Config = {
    ...options,

    // Overrides
    name: options.name || 'svg/recommended',
    files: options.files || ['**/*.svg'],
    ignores: options.ignores || [],
    languageOptions: options.languageOptions,
    plugins: {
      ...(options.plugins || {}),

      /* v8 ignore start */
      get svg() {
        return plugin
      },
      /* v8 ignore stop */
    },
    rules: {
      ...(options.overridesRules || {}),
    },
  }
  return config
}

export const recommended = [
  // flat recommended config
  createRecommendedConfig(),
]

export const configs = {
  recommended,
}
