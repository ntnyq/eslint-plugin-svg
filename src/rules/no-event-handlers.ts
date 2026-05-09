import { createESLintRule, resolveOptions } from '../utils'

export const RULE_NAME = 'no-event-handlers'
export type MessageIds = 'invalid' | 'invalidPattern'
export type Options = [
  {
    /**
     * deprecated alias of ignorePatterns
     */
    ignores?: string[]
    /**
     * exact event handler attributes to ignore
     */
    ignoreAttributes?: string[]
    /**
     * regexp patterns used to ignore event handler names
     */
    ignorePatterns?: string[]
  },
]

const defaultOptions: Options[0] = {}

/**
 * Convert an unknown regex error into a readable message.
 */
function getPatternErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Unknown regular expression error'
}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow inline event handler attributes (e.g. onclick)',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreAttributes: {
            type: 'array',
            description: 'Exact event handler attribute names to ignore',
            items: {
              type: 'string',
            },
            uniqueItems: true,
          },
          ignorePatterns: {
            type: 'array',
            description: 'Regular expression patterns to ignore event handlers',
            items: {
              type: 'string',
            },
            uniqueItems: true,
          },
          ignores: {
            type: 'array',
            description:
              'Deprecated alias of ignorePatterns for backward compatibility',
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
      invalidPattern: `Invalid ignore pattern '{{pattern}}' in no-event-handlers: {{error}}`,
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const {
      ignores = [],
      ignoreAttributes = [],
      ignorePatterns = [],
    } = resolveOptions(context.options, defaultOptions)

    const ignoredAttributes = new Set(
      ignoreAttributes.map(name => name.toLowerCase()),
    )

    const patterns = [...ignorePatterns, ...ignores]

    const validIgnorePatterns: RegExp[] = []
    const invalidIgnorePatterns: Array<{ pattern: string; error: string }> = []

    for (const pattern of patterns) {
      try {
        validIgnorePatterns.push(new RegExp(pattern))
      } catch (err) {
        invalidIgnorePatterns.push({
          pattern,
          error: getPatternErrorMessage(err),
        })
      }
    }

    const isIgnored = (name: string): boolean => {
      const lowerName = name.toLowerCase()

      if (ignoredAttributes.has(lowerName)) {
        return true
      }

      return validIgnorePatterns.some(pattern => pattern.test(name))
    }

    return {
      Program(node) {
        for (const invalidPattern of invalidIgnorePatterns) {
          context.report({
            node,
            messageId: 'invalidPattern',
            data: {
              pattern: invalidPattern.pattern,
              error: invalidPattern.error,
            },
          })
        }
      },
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
