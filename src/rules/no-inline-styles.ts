import { createESLintRule } from '../utils'

export const RULE_NAME = 'no-inline-styles'
export type MessageIds = 'invalid'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow inline style attribute usage',
      recommended: true,
    },
    schema: [],
    messages: {
      invalid: 'Inline style attributes are not allowed',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Attribute(node) {
        if (node.key.value !== 'style') {
          return
        }

        context.report({
          node: node.value ?? node.key,
          messageId: 'invalid',
        })
      },
    }
  },
})
