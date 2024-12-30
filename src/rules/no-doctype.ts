import { createESLintRule } from '../utils'

export const RULE_NAME = 'no-doctype'
export type MessageIds = 'invalid'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow doctype',
      recommended: true,
    },
    schema: [],
    messages: {
      invalid: 'Doctype is not allowed',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Doctype(node) {
        context.report({
          node,
          messageId: 'invalid',
        })
      },
    }
  },
})
