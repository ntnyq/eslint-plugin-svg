import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule } from '../utils'

export const RULE_NAME = 'no-empty-groups'
export type MessageIds = 'invalid'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow empty group element',
      recommended: true,
    },
    schema: [],
    messages: {
      invalid: `Group element 'g' must not be empty`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Tag(node) {
        if (node.name !== 'g') {
          return
        }

        const children = (node.children ?? [])
          .filter(child => child.type !== 'Comment')
          .filter(child => {
            if (child.type !== 'Text') {
              return true
            }

            return isNonEmptyString((child.value ?? '').trim())
          })

        if (children.length === 0) {
          context.report({
            node,
            messageId: 'invalid',
          })
        }
      },
    }
  },
})
