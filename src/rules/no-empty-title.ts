import { createESLintRule } from '../utils'

export const RULE_NAME = 'no-empty-title'
export type MessageIds = 'invalid'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow empty title element',
      recommended: true,
    },
    schema: [],
    messages: {
      invalid: 'Element title must not be empty',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Tag(node) {
        if (node.name !== 'title') {
          return
        }

        if (
          !node.children
          || node.children.length === 0
          || node.children.every(
            child => child.type === 'Text' && !child.value.trim(),
          )
        ) {
          return context.report({
            node,
            messageId: 'invalid',
          })
        }
      },
    }
  },
})
