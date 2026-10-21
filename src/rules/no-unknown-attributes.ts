import { ALL_ATTRIBUTES } from '../constants'
import { createESLintRule, getSvgElementName, resolveOptions } from '../utils'

export const RULE_NAME = 'no-unknown-attributes'
export type MessageIds = 'unknown' | 'replace'
export type Options = [
  {
    /**
     * Additional case-sensitive attribute names allowed by the project.
     *
     * @default []
     */
    allowAttributes?: string[]
  },
]

const defaultOptions: Required<Options[0]> = { allowAttributes: [] }
const knownAttributes = new Set(ALL_ATTRIBUTES)

/**
 * Compare short attribute names for spelling suggestions.
 */
function getEditDistance(left: string, right: string): number {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let row = 1; row <= left.length; row++) {
    const current = [row]
    for (let column = 1; column <= right.length; column++) {
      current[column] = Math.min(
        current[column - 1]! + 1,
        previous[column]! + 1,
        previous[column - 1]! + (left[row - 1] === right[column - 1] ? 0 : 1),
      )
    }
    previous = current
  }
  return previous[right.length]!
}

/**
 * Offer only an unambiguous close match; never rename an attribute automatically.
 */
function getSuggestedName(name: string): string | undefined {
  // Long custom attribute names cannot be close matches and need no matrix.
  if (name.length > 40) {
    return undefined
  }
  let bestDistance = name.length > 3 ? 2 : 1
  let matches: string[] = []
  for (const candidate of ALL_ATTRIBUTES) {
    if (Math.abs(candidate.length - name.length) > bestDistance) {
      continue
    }
    const distance = getEditDistance(
      name.toLowerCase(),
      candidate.toLowerCase(),
    )
    if (distance < bestDistance) {
      bestDistance = distance
      matches = [candidate]
    } else if (distance === bestDistance) {
      matches.push(candidate)
    }
  }
  return matches.length === 1 ? matches[0] : undefined
}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow unknown SVG attribute names',
      recommended: false,
    },
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          allowAttributes: {
            type: 'array',
            description: 'additional attribute names to allow',
            items: { type: 'string' },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unknown: "Attribute '{{name}}' is not a known SVG attribute",
      replace: "Replace '{{name}}' with '{{replacement}}'",
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const { allowAttributes } = resolveOptions(context.options, defaultOptions)
    const allowedAttributes = new Set(allowAttributes)
    return {
      Element(node) {
        if (getSvgElementName(node) === null) {
          return
        }
        for (const attribute of node.attributes) {
          const key = attribute.key
          if (!key) {
            continue
          }
          const name = key.value
          if (
            knownAttributes.has(name)
            || allowedAttributes.has(name)
            || name.includes(':')
            || (name.startsWith('data-') && name.length > 5)
            || /^aria-[\w-]+$/.test(name)
            || /^on[a-z]+$/.test(name)
          ) {
            continue
          }
          const replacement = getSuggestedName(name)
          context.report({
            node: key,
            messageId: 'unknown',
            data: { name },
            suggest:
              replacement
              && !node.attributes.some(attr => attr.key?.value === replacement)
                ? [
                    {
                      messageId: 'replace',
                      data: { name, replacement },
                      fix(fixer) {
                        return fixer.replaceTextRange(key.range, replacement)
                      },
                    },
                  ]
                : [],
          })
        }
      },
    }
  },
})
