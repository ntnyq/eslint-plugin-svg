import type { Linter } from 'eslint'
import type { rules } from '../rules'

export interface PluginSVG {
  rules: typeof rules
  configs: {
    recommended: Linter.Config<Linter.RulesRecord>[]
  }
  meta: {
    name: string
    version: string
  }
}
