import { createESLintRule } from '../utils'

export const RULE_NAME = 'no-comments'
export type MessageIds = 'invalid'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow comments in SVG files',
      recommended: false,
    },
    schema: [],
    messages: {
      invalid: 'Comments are not allowed in SVG files',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Comment(node) {
        context.report({
          node,
          messageId: 'invalid',
        })
      },
    }
  },
})
