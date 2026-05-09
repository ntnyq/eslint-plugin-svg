import { ALL_ARIA_ROLES, ARIA_ROLES } from '../constants'
import { createESLintRule, resolveOptions } from '../utils'

export const RULE_NAME = 'no-invalid-role'
export type MessageIds = 'invalid'
export type Options = [
  {
    roles?: string[]
    allowAbstractRoles?: boolean
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
              enum: ALL_ARIA_ROLES,
            },
            uniqueItems: true,
          },
          allowAbstractRoles: {
            type: 'boolean',
            description: 'whether abstract ARIA roles are considered valid',
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
    const { roles = [], allowAbstractRoles = false } = resolveOptions(
      context.options,
      defaultOptions,
    )

    const allRoles = allowAbstractRoles ? ALL_ARIA_ROLES : ARIA_ROLES

    const allowedRoles = roles.length
      ? roles.filter(v => allRoles.includes(v))
      : allRoles

    return {
      Attribute(node) {
        if (!node.value || node.key.value !== 'role') {
          return
        }

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
