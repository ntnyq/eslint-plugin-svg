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
  // FIXME: type not match
  rules: rules as unknown as Record<string, Rule.RuleModule>,
  configs,
} satisfies ESLint.Plugin

export default plugin

export * from './dts'
export * from './meta'
export * from './rules'
export * from './configs'
