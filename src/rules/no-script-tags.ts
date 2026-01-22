import { createESLintRule } from '../utils'

export const RULE_NAME = 'no-script-tags'
export type MessageIds = 'invalid'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of script elements',
      recommended: true,
    },
    schema: [],
    messages: {
      invalid: `Script elements are not allowed in SVG`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Tag(node) {
        if (node.name !== 'script') {
          return
        }

        context.report({
          node,
          messageId: 'invalid',
        })
      },
    }
  },
})
