import { createNoEmptyElementRule } from './ruleFactories'

export const RULE_NAME = 'no-empty-title'
export type MessageIds = 'invalid'
export type Options = []

export default createNoEmptyElementRule({
  ruleName: RULE_NAME,
  elementName: 'title',
  description: 'disallow empty title element',
})
