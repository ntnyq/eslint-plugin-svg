import { configs } from './configs'
import { meta } from './meta'
import { rules } from './rules'
import type { ESLint, Rule } from 'eslint'

/**
 * eslint-plugin-svg
 * Rules for consistent, readable and valid SVG files.
 *
 * @see {@link https://github.com/ntnyq/eslint-plugin-svg}
 */
export const plugin = {
  meta,
  rules: rules as unknown as Record<string, Rule.RuleModule>,
  configs,
} satisfies ESLint.Plugin

export * from './dts'
export * from './meta'
export * from './rules'
export * from './configs'

export default plugin
