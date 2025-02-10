import { isNonEmptyString } from '@ntnyq/utils'
import { CONTAINER_ELEMENTS } from '../constants'
import { createESLintRule, resolveOptions } from '../utils'

export const RULE_NAME = 'no-empty-container'
export type MessageIds = 'invalid'
export type Options = [
  {
    elements?: string[]
    ignores?: string[]
    ignoreComments?: boolean
    ignoreWhitespace?: boolean
  },
]

const defaultOptions: Options[0] = {}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow empty container element',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          elements: {
            type: 'array',
            description: 'container elements to be checked',
            items: {
              type: 'string',
            },
            uniqueItems: true,
          },
          ignores: {
            type: 'array',
            description: 'container elements to be ignored',
            items: {
              type: 'string',
            },
            uniqueItems: true,
          },
          ignoreComments: {
            type: 'boolean',
            description: 'whether ignore comments nodes',
          },
          ignoreWhitespace: {
            type: 'boolean',
            description: 'whether ignore whitespace nodes',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalid: `Container element '{{name}}' must not be empty`,
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const {
      elements = [],
      ignores = [],
      ignoreComments = true,
      ignoreWhitespace = true,
    } = resolveOptions(context.options)
    const containerElements = new Set(
      [
        // built-in container elements
        ...CONTAINER_ELEMENTS,
        // user defined container elements
        ...elements,
      ].filter(v => !ignores.includes(v)),
    )

    return {
      Tag(node) {
        if (!containerElements.has(node.name)) {
          return
        }

        const children = node.children
          .filter(n => !ignoreComments || n.type !== 'Comment')
          .filter(
            n =>
              !ignoreWhitespace
              || n.type !== 'Text'
              || isNonEmptyString(n.value.trim()),
          )

        if (children.length === 0) {
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
