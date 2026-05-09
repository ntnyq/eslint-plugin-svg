import { createNoEmptyElementRule } from './ruleFactories'

export const RULE_NAME = 'no-empty-text'
export type MessageIds = 'invalid'
export type Options = []

export default createNoEmptyElementRule({
  ruleName: RULE_NAME,
  elementName: 'text',
  description: 'disallow empty text element',
})
