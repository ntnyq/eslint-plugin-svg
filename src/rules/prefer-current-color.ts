import { createESLintRule, resolveOptions } from '../utils'

export const RULE_NAME = 'prefer-current-color'
export type MessageIds = 'invalid'
export type Options = [
  {
    /**
     * paint attributes to check
     *
     * @default ['fill', 'stroke']
     */
    attributes?: Array<'fill' | 'stroke'>
    /**
     * literal values to skip from reporting
     *
     * @default ['none', 'transparent']
     */
    ignoreValues?: string[]
    /**
     * hardcoded colors allowed by project convention
     *
     * @default []
     */
    allowColors?: string[]
  },
]

const defaultOptions: Required<Options[0]> = {
  attributes: ['fill', 'stroke'],
  ignoreValues: ['none', 'transparent'],
  allowColors: [],
}

const COLOR_FUNCTION_PATTERN =
  /^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(/i
const HEX_COLOR_PATTERN = /^#[\da-f]{3,8}$/i
const NAMED_COLOR_PATTERN = /^[a-z]+$/i

/**
 * Normalize values for case-insensitive color comparisons.
 */
function normalize(value: string): string {
  return value.trim().toLowerCase()
}

/**
 * Detect whether a value is a direct color literal.
 */
function isHardcodedColor(value: string): boolean {
  const normalizedValue = normalize(value)

  if (!normalizedValue) {
    return false
  }

  if (HEX_COLOR_PATTERN.test(normalizedValue)) {
    return true
  }

  if (COLOR_FUNCTION_PATTERN.test(normalizedValue)) {
    return true
  }

  return NAMED_COLOR_PATTERN.test(normalizedValue)
}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require currentColor for icon fill and stroke attributes instead of hardcoded colors',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          attributes: {
            type: 'array',
            description: 'paint attributes that should prefer currentColor',
            items: {
              type: 'string',
              enum: ['fill', 'stroke'],
            },
            uniqueItems: true,
          },
          ignoreValues: {
            type: 'array',
            description:
              'attribute values to ignore before checking currentColor preference',
            items: {
              type: 'string',
            },
            uniqueItems: true,
          },
          allowColors: {
            type: 'array',
            description: 'hardcoded color values to allow',
            items: {
              type: 'string',
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalid:
        "Use currentColor for '{{name}}' instead of hardcoded color '{{value}}'",
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const { attributes, ignoreValues, allowColors } = {
      ...defaultOptions,
      ...resolveOptions(context.options, defaultOptions),
    }

    const targetAttributes = new Set(attributes.map(name => normalize(name)))
    const ignoredValues = new Set(ignoreValues.map(value => normalize(value)))
    const allowedColors = new Set(allowColors.map(value => normalize(value)))

    return {
      Attribute(node) {
        if (!node.value) {
          return
        }

        const attributeName = normalize(node.key.value)

        if (!targetAttributes.has(attributeName)) {
          return
        }

        const rawValue = node.value.value
        const normalizedValue = normalize(rawValue)

        if (!normalizedValue || normalizedValue === 'currentcolor') {
          return
        }

        if (ignoredValues.has(normalizedValue)) {
          return
        }

        if (allowedColors.has(normalizedValue)) {
          return
        }

        if (!isHardcodedColor(normalizedValue)) {
          return
        }

        context.report({
          node: node.value,
          messageId: 'invalid',
          data: {
            name: node.key.value,
            value: rawValue,
          },
        })
      },
    }
  },
})
