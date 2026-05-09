import { createNoEmptyElementRule } from './ruleFactories'

export const RULE_NAME = 'no-empty-desc'
export type MessageIds = 'invalid'
export type Options = []

export default createNoEmptyElementRule({
  ruleName: RULE_NAME,
  elementName: 'desc',
  description: 'disallow empty desc element',
})
