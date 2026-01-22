import { isNonEmptyString, toArray } from '@ntnyq/utils'
import { createESLintRule } from '../utils'

export const RULE_NAME = 'require-viewbox'
export type MessageIds = 'missing'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require svg elements to include a non-empty viewBox attribute',
      recommended: true,
    },
    schema: [],
    messages: {
      missing: `SVG element must include a non-empty viewBox attribute`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Tag(node) {
        if (node.name !== 'svg') {
          return
        }
        const attributes = toArray(node.attributes)

        const viewBoxAttr = attributes.find(
          attr => attr.key.value === 'viewBox',
        )

        if (!viewBoxAttr) {
          context.report({
            node,
            messageId: 'missing',
          })
          return
        }

        const value = viewBoxAttr.value?.value ?? ''

        if (!isNonEmptyString(value.trim())) {
          context.report({
            node: viewBoxAttr.value ?? viewBoxAttr.key,
            messageId: 'missing',
          })
        }
      },
    }
  },
})
