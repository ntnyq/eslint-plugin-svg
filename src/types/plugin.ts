import type { Linter } from 'eslint'
import type { rules } from '../rules'

export interface PluginSVG {
  rules: typeof rules
  configs: {
    a11y: Linter.Config<Linter.RulesRecord>[]
    recommended: Linter.Config<Linter.RulesRecord>[]
    security: Linter.Config<Linter.RulesRecord>[]
    strict: Linter.Config<Linter.RulesRecord>[]
  }
  meta: {
    name: string
    version: string
  }
}
