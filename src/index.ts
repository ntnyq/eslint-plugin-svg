import { configs } from './configs'
import { meta } from './meta'
import { rules } from './rules'
import type { PluginSVG } from './types/plugin'

/**
 * eslint-plugin-svg
 * Rules for consistent, readable and valid SVG files.
 *
 * @see {@link https://github.com/ntnyq/eslint-plugin-svg}
 */
export const plugin: PluginSVG = {
  meta,
  rules,
  configs,
}

export * from './meta'
export * from './rules'
export * from './configs'

export default plugin
