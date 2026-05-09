import { createESLintRule, parseDataUrl } from '../utils'

export const RULE_NAME = 'no-unsafe-href'
export type MessageIds = 'invalid'
export type Options = []

const HREF_ATTRIBUTES = new Set(['href', 'xlink:href'])

/**
 * Normalize attribute names and URL values for safe comparisons.
 */
function normalize(value: string): string {
  return value.trim().toLowerCase()
}

/**
 * Check whether a URL points to a remote resource.
 */
function isUnsafeRemoteUrl(value: string): boolean {
  return (
    value.startsWith('http://')
    || value.startsWith('https://')
    || value.startsWith('//')
  )
}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow unsafe href and xlink:href URL values',
      recommended: false,
    },
    schema: [],
    messages: {
      invalid: `Unsafe URL value '{{value}}' is not allowed in attribute '{{name}}'`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Attribute(node) {
        if (!node.value) {
          return
        }

        const attributeName = normalize(node.key.value)

        if (!HREF_ATTRIBUTES.has(attributeName)) {
          return
        }

        const rawValue = node.value.value
        const normalizedValue = normalize(rawValue)

        if (!normalizedValue) {
          return
        }

        const isUnsafe =
          normalizedValue.startsWith('javascript:')
          || parseDataUrl(normalizedValue).isDataUrl
          || isUnsafeRemoteUrl(normalizedValue)

        if (!isUnsafe) {
          return
        }

        context.report({
          node: node.value,
          messageId: 'invalid',
          data: {
            name: node.key.value,
            value: rawValue,
          },
        })
      },
    }
  },
})
