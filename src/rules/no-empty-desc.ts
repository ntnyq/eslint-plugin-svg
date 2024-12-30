import { createESLintRule } from '../utils'

export const RULE_NAME = 'no-empty-desc'
export type MessageIds = 'invalid'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow empty desc element',
      recommended: true,
    },
    schema: [],
    messages: {
      invalid: 'Element desc must not be empty',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Tag(node) {
        if (node.name !== 'desc') {
          return
        }

        const textNode = node.children.find(n => n.type === 'Text')

        if (textNode) {
          if (!textNode.value.trim()) {
            return context.report({
              node,
              messageId: 'invalid',
            })
          }
        } else {
          return context.report({
            node,
            messageId: 'invalid',
          })
        }
      },
    }
  },
})
