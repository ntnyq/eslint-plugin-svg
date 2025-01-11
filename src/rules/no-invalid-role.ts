import { ARIA_ROLES } from '../constants'
import { createESLintRule, resolveOptions } from '../utils'

export const RULE_NAME = 'no-invalid-role'
export type MessageIds = 'invalid'
export type Options = [
  {
    roles?: string[]
  },
]

const defaultOptions: Options[0] = {}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow invalid value of role attribute',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          roles: {
            type: 'array',
            description: 'allowed roles',
            items: {
              type: 'string',
              enum: ARIA_ROLES,
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalid: `Attribute role value '{{value}}' is invalid`,
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const { roles = [] } = resolveOptions(context.options)
    const allowedRoles = roles.length ? roles.filter(v => ARIA_ROLES.includes(v)) : ARIA_ROLES

    return {
      Attribute(node) {
        if (!node.value || node.key.value !== 'role') return

        if (!allowedRoles.includes(node.value.value)) {
          context.report({
            node: node.value,
            messageId: 'invalid',
            data: {
              value: node.value.value,
            },
          })
        }
      },
    }
  },
})
