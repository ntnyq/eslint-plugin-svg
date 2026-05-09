import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, getTextContent } from '../utils'

export function createNoEmptyElementRule({
  ruleName,
  elementName,
  description,
  recommended = true,
}: {
  ruleName: string
  elementName: string
  description: string
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

export function createNoElementRule({
  ruleName,
  description,
  message,
  defaultElements = [],
  recommended = true,
  allowConfigurableElements = true,
}: {
  ruleName: string
  description: string
  message: string
  defaultElements?: string[]
  recommended?: boolean
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
