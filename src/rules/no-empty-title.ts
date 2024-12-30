import { createESLintRule } from '../utils'

export const RULE_NAME = 'no-empty-title'
export type MessageIds = 'invalid'
export type Options = []

export default createESLintRule({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow empty title',
      recommended: true,
    },
    schema: [],
    messages: {
      invalid: '',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Program(node) {
        context.report({
          node,
          messageId: 'invalid',
        })
      },
    }
  },
})
