import { createESLintRule, resolveOptions } from '../utils'

export const RULE_NAME = 'no-event-handlers'
export type MessageIds = 'invalid'
export type Options = [
  {
    ignores?: string[]
  },
]

const defaultOptions: Options[0] = {}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow inline event handler attributes (e.g. onclick)',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignores: {
            type: 'array',
            description: 'Event handler attribute names to ignore',
            items: {
              type: 'string',
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalid: `Inline event handler '{{name}}' is not allowed`,
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const { ignores = [] } = resolveOptions(context.options, defaultOptions)

    const ignorePatterns = ignores.map(pattern => new RegExp(pattern))

    const isIgnored = (name: string): boolean =>
      ignorePatterns.some(pattern => pattern.test(name))

    return {
      Attribute(node) {
        const name = node.key.value

        if (!name || !name.toLowerCase().startsWith('on')) {
          return
        }

        if (isIgnored(name)) {
          return
        }

        context.report({
          node: node.value ?? node.key,
          messageId: 'invalid',
          data: {
            name,
          },
        })
      },
    }
  },
})
