import { createNoElementRule } from './ruleFactories'

export const RULE_NAME = 'no-elements'
export type MessageIds = 'invalid'
export type Options = [
  {
    /** elements to disallow */
    elements?: string[]
  },
]

export default createNoElementRule({
  ruleName: RULE_NAME,
  description: 'disallow elements by name',
  message: `Element '{{name}}' is not allowed`,
})
