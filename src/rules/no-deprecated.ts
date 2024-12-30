import { DEPRECATED_ELEMENTS } from '../constants'
import { createESLintRule } from '../utils'

export const RULE_NAME = 'no-deprecated'
export type MessageIds = 'deprecatedElement'
export type Options = [
  {
    allowElements?: string[]
  },
]

const defaultOptions: Options[0] = {}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow deprecated elements',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowElements: {
            type: 'array',
            description: 'Allowed deprecated elements',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      deprecatedElement: `Element '{{name}}' is deprecated`,
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const { allowElements = [] } = context.options?.[0] || {}
    const deprecatedElements = new Set(
      DEPRECATED_ELEMENTS.filter(element => !allowElements.includes(element)),
    )
    return {
      Tag(node) {
        if (deprecatedElements.has(node.name)) {
          context.report({
            node,
            messageId: 'deprecatedElement',
            data: {
              name: node.name,
            },
          })
        }
      },
    }
  },
})
