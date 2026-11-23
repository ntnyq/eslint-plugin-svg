import { isNonEmptyString } from '@ntnyq/utils'
import {
  createESLintRule,
  decodeXmlReferences,
  getSvgElementName,
} from '../utils'

export const RULE_NAME = 'no-empty-groups'
export type MessageIds = 'invalid'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow empty group element',
      recommended: false,
    },
    schema: [],
    messages: {
      invalid: `Group element 'g' must not be empty`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Element(node) {
        if (getSvgElementName(node) !== 'g') {
          return
        }

        const children = (node.children ?? [])
          .filter(child => child.type !== 'Comment')
          .filter(child => {
            if (child.type !== 'Text' && child.type !== 'CDATA') {
              return true
            }

            const value =
              child.type === 'Text'
                ? decodeXmlReferences(child.value)
                : child.value

            return isNonEmptyString(value.trim())
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
