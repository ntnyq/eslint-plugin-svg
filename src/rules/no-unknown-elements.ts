import { ALL_ELEMENTS } from '../constants'
import { createESLintRule } from '../utils'

export const RULE_NAME = 'no-unknown-elements'
export type MessageIds = 'invalid'
export type Options = []

const knownElements = new Set(ALL_ELEMENTS.map(name => name.toLowerCase()))

/**
 * Check whether an element name exists in the SVG element allowlist.
 */
function isKnownElement(name: string): boolean {
  return knownElements.has(name.toLowerCase())
}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow non-standard SVG elements',
      recommended: true,
    },
    schema: [],
    messages: {
      invalid: `Element '{{name}}' is not a standard SVG element`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Element(node) {
        if (isKnownElement(node.name)) {
          return
        }

        context.report({
          node,
          messageId: 'invalid',
          data: {
            name: node.name,
          },
        })
      },
    }
  },
})
