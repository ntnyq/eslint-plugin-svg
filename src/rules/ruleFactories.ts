import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, getTextContent } from '../utils'

/**
 * Create a rule that reports empty content for a fixed element name.
 */
export function createNoEmptyElementRule({
  ruleName,
  elementName,
  description,
  recommended = true,
}: {
  /** rule name used by ESLint */
  ruleName: string
  /** element name to validate */
  elementName: string
  /** rule description in metadata */
  description: string
  /** whether the rule is enabled in recommended preset */
  recommended?: boolean
}) {
  return createESLintRule<[], 'invalid'>({
    name: ruleName,
    meta: {
      type: 'suggestion',
      docs: {
        description,
        recommended,
      },
      schema: [],
      messages: {
        invalid: `Element ${elementName} must not be empty`,
      },
    },
    defaultOptions: [],
    create(context) {
      return {
        Element(node) {
          if (node.name !== elementName) {
            return
          }

          const textContent = getTextContent(node, {
            ignoreComments: true,
            ignoreWhitespace: true,
          })

          if (isNonEmptyString(textContent.trim())) {
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
}

/**
 * Create a rule that forbids elements by name with optional configuration.
 */
export function createNoElementRule({
  ruleName,
  description,
  message,
  defaultElements = [],
  recommended = true,
  allowConfigurableElements = true,
}: {
  /** rule name used by ESLint */
  ruleName: string
  /** rule description in metadata */
  description: string
  /** error message template */
  message: string
  /** default forbidden elements */
  defaultElements?: string[]
  /** whether the rule is enabled in recommended preset */
  recommended?: boolean
  /** allow users to override disallowed element list */
  allowConfigurableElements?: boolean
}) {
  if (!allowConfigurableElements) {
    return createESLintRule<[], 'invalid'>({
      name: ruleName,
      meta: {
        type: 'suggestion',
        docs: {
          description,
          recommended,
        },
        schema: [],
        messages: {
          invalid: message,
        },
      },
      defaultOptions: [],
      create(context) {
        const disallowedElements = new Set(defaultElements)

        if (!disallowedElements.size) {
          return {}
        }

        return {
          Element(node) {
            if (!disallowedElements.has(node.name)) {
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
  }

  type Options = [
    {
      /** elements to disallow for this rule */
      elements?: string[]
    },
  ]

  const defaultOptions: Options[0] = {}

  return createESLintRule<Options, 'invalid'>({
    name: ruleName,
    meta: {
      type: 'suggestion',
      docs: {
        description,
        recommended,
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
        invalid: message,
      },
    },
    defaultOptions: [defaultOptions],
    create(context) {
      const configuredElements = context.options[0]?.elements ?? []
      const disallowedElements = new Set([
        ...defaultElements,
        ...configuredElements,
      ])

      if (!disallowedElements.size) {
        return {}
      }

      return {
        Element(node) {
          if (!disallowedElements.has(node.name)) {
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
}
