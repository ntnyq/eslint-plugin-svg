import {
  createESLintRule,
  getAttributeValue,
  getLocalReferences,
  resolveOptions,
} from '../utils'
import type { LocalReference } from '../utils/references'

export const RULE_NAME = 'no-unresolved-references'
export type MessageIds = 'unresolved'
export type Options = [
  {
    /**
     * IDs supplied by the host document or injected at runtime.
     *
     * @default []
     */
    allowIds?: string[]
  },
]

const defaultOptions: Required<Options[0]> = { allowIds: [] }

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow unresolved document-local SVG references',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowIds: {
            type: 'array',
            description: 'IDs supplied outside the SVG document',
            items: { type: 'string' },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unresolved: "Reference to unknown id '{{id}}' in attribute '{{name}}'",
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const { allowIds } = resolveOptions(context.options, defaultOptions)
    const ids = new Set(allowIds)
    const references: LocalReference[] = []
    return {
      Element(node) {
        const id = getAttributeValue(node, 'id')
        if (id) {
          ids.add(id)
        }
        references.push(...getLocalReferences(node))
      },
      'Document:exit': function () {
        for (const { attribute, id } of references) {
          if (!ids.has(id)) {
            context.report({
              node: attribute,
              messageId: 'unresolved',
              data: { id, name: attribute.key?.value },
            })
          }
        }
      },
    }
  },
})
