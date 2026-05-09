import { createNoElementRule } from './ruleFactories'

export const RULE_NAME = 'no-script-tags'
export type MessageIds = 'invalid'
export type Options = []

export default createNoElementRule({
  ruleName: RULE_NAME,
  description: 'disallow usage of script elements',
  message: `Script elements are not allowed in SVG`,
  defaultElements: ['script'],
  allowConfigurableElements: false,
})
