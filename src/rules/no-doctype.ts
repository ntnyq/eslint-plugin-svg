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
    fixable: 'code',
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
          // Internal and external DTDs may declare entities or default attributes.
          fix(fixer) {
            if (
              node.internalSubset !== undefined
              || node.attributes.length !== 1
            ) {
              return null
            }
            return fixer.remove(node)
          },
        })
      },
    }
  },
})
