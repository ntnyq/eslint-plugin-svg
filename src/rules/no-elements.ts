import { createESLintRule, resolveOptions } from '../utils'

export const RULE_NAME = 'no-elements'
export type MessageIds = 'invalid'
export type Options = [
  {
    elements?: string[]
  },
]

const defaultOptions: Options[0] = {}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow elements by name',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          elements: {
            type: 'array',
            description: 'elements to be disallowed',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalid: `Element '{{name}}' is not allowed`,
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const { elements = [] } = resolveOptions(context.options)

    if (!elements.length) {
      return {}
    }

    return {
      Tag(node) {
        if (elements.includes(node.name)) {
          context.report({
            node,
            messageId: 'invalid',
            data: {
              name: node.name,
            },
          })
        }
      },
    }
  },
})
