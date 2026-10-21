import { DISCOURAGED_SVG_ARIA_ROLES } from '../constants'
import {
  createESLintRule,
  decodeXmlAttribute,
  getEffectiveRole,
  getParentElement,
  getSvgElementName,
  resolveOptions,
} from '../utils'

export const RULE_NAME = 'no-discouraged-role'
export type MessageIds = 'discouraged'
export type Options = [
  {
    /** discouraged roles to report */
    roles?: string[]
  },
]

const defaultOptions: Options[0] = {}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow discouraged role values in SVG context',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          roles: {
            type: 'array',
            description: 'discouraged roles to check',
            items: {
              type: 'string',
              enum: DISCOURAGED_SVG_ARIA_ROLES,
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      discouraged: `Attribute role value '{{value}}' is discouraged for SVG and should be avoided`,
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const { roles = [] } = resolveOptions(context.options, defaultOptions)

    const discouragedRoles = new Set(
      roles.length
        ? roles.filter(value => DISCOURAGED_SVG_ARIA_ROLES.includes(value))
        : DISCOURAGED_SVG_ARIA_ROLES,
    )

    return {
      Attribute(node) {
        if (!node.key || !node.value || node.key.value !== 'role') {
          return
        }

        const parent = getParentElement(node)
        if (!parent || getSvgElementName(parent) === null) {
          return
        }

        const role = getEffectiveRole(decodeXmlAttribute(node.value.value))
        if (!role || !discouragedRoles.has(role)) {
          return
        }

        context.report({
          node: node.value,
          messageId: 'discouraged',
          data: {
            value: node.value.value,
          },
        })
      },
    }
  },
})
