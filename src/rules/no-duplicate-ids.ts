import { createESLintRule } from '../utils'

export const RULE_NAME = 'no-duplicate-ids'
export type MessageIds = 'duplicate'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow duplicate id attributes in SVG elements',
      recommended: true,
    },
    schema: [],
    messages: {
      duplicate: `Duplicate id '{{id}}' found`,
    },
  },
  defaultOptions: [],
  create(context) {
    const seenIds = new Set<string>()

    return {
      Tag(node) {
        const idAttribute = node.attributes?.find(
          attr => attr.key.value === 'id',
        )

        if (!idAttribute || !idAttribute.value || !idAttribute.value.value) {
          return
        }

        const id = idAttribute.value.value

        if (seenIds.has(id)) {
          context.report({
            node: idAttribute,
            messageId: 'duplicate',
            data: {
              id,
            },
          })
        } else {
          seenIds.add(id)
        }
      },
    }
  },
})
