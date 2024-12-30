import { createESLintRule } from '../utils'

export const RULE_NAME = 'no-empty-text'
export type MessageIds = 'invalid'
export type Options = []

export default createESLintRule({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow empty text element',
      recommended: true,
    },
    schema: [],
    messages: {
      invalid: 'Element text must not be empty',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Tag(node) {
        if (node.name !== 'text') {
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
