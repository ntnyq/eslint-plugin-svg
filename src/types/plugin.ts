import type { Linter } from 'eslint'
import type { rules } from '../rules'

export interface PluginSVG {
  /** rule implementations exposed by the plugin */
  rules: typeof rules
  /** named config presets exposed by the plugin */
  configs: {
    /** accessibility preset */
    a11y: Linter.Config<Linter.RulesRecord>[]
    /** recommended baseline preset */
    recommended: Linter.Config<Linter.RulesRecord>[]
    /** security-focused preset */
    security: Linter.Config<Linter.RulesRecord>[]
    /** strict preset with additional stylistic checks */
    strict: Linter.Config<Linter.RulesRecord>[]
  }
  /** plugin package metadata */
  meta: {
    /** package name */
    name: string
    /** package version */
    version: string
  }
}
