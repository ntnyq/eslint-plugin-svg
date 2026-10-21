import { isNonEmptyString, toArray } from '@ntnyq/utils'
import {
  createESLintRule,
  decodeXmlAttribute,
  getSvgElementName,
  resolveOptions,
} from '../utils'

export const RULE_NAME = 'require-viewbox'
export type MessageIds = 'missing' | 'invalid'
export type Options = [
  {
    /**
     * whether to validate the numeric viewBox format
     *
     * @default true
     */
    validateFormat?: boolean
  },
]

const defaultOptions: Required<Options[0]> = {
  validateFormat: true,
}

/**
 * Validate an SVG viewBox value.
 */
function isValidViewBoxValue(value: string): boolean {
  // Collapse only XML whitespace, preserving empty comma-separated values.
  const parts = value
    .split(/[ \t\r\n]+/)
    .filter(Boolean)
    .join(' ')
    .split(/ ?, ?| /)

  if (
    parts.length !== 4
    || parts.some(
      part => !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(part),
    )
  ) {
    return false
  }

  const numbers = parts.map(part => Number(part))

  if (numbers.some(number => !Number.isFinite(number))) {
    return false
  }

  return numbers[2] > 0 && numbers[3] > 0
}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require svg elements to include a non-empty viewBox attribute',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          validateFormat: {
            type: 'boolean',
            description:
              'whether to validate viewBox format as four finite numbers with positive width and height',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missing: `SVG element must include a non-empty viewBox attribute`,
      invalid: `SVG viewBox must contain four numbers and positive width and height`,
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const options = {
      ...defaultOptions,
      ...resolveOptions(context.options, defaultOptions),
    }

    return {
      Element(node) {
        if (getSvgElementName(node) !== 'svg') {
          return
        }
        const attributes = toArray(node.attributes)

        const viewBoxAttr = attributes.find(
          attr => attr.key?.value === 'viewBox',
        )

        if (!viewBoxAttr) {
          context.report({
            node,
            messageId: 'missing',
          })
          return
        }

        const value = decodeXmlAttribute(viewBoxAttr.value?.value ?? '')

        if (!isNonEmptyString(value.trim())) {
          context.report({
            node: viewBoxAttr.value ?? viewBoxAttr.key ?? viewBoxAttr,
            messageId: 'missing',
          })
          return
        }

        if (options.validateFormat && !isValidViewBoxValue(value)) {
          context.report({
            node: viewBoxAttr.value ?? viewBoxAttr.key ?? viewBoxAttr,
            messageId: 'invalid',
          })
        }
      },
    }
  },
})
