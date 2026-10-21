import {
  createESLintRule,
  decodeXmlAttribute,
  getSvgElementName,
} from '../utils'

export const RULE_NAME = 'no-invalid-path-data'
export type MessageIds = 'invalid'
export type Options = []

const PARAMETER_COUNTS = new Map([
  ['m', 2],
  ['l', 2],
  ['h', 1],
  ['v', 1],
  ['c', 6],
  ['s', 4],
  ['q', 4],
  ['t', 2],
  ['a', 7],
])
const EMPTY_PATH_VALUES = new Set([
  'none',
  'inherit',
  'initial',
  'unset',
  'revert',
  'revert-layer',
])

/**
 * Consume complete command groups using the SVG 2 path number grammar.
 */
function isValidPathData(value: string): boolean {
  if (!value || EMPTY_PATH_VALUES.has(value.toLowerCase())) {
    return true
  }
  if (!/^m/i.test(value)) {
    return false
  }
  const numberPattern = /[+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?/iy
  let index = 0
  let command = ''

  function skipWhitespace() {
    while (index < value.length && /[\t\n\f\r ]/.test(value[index]!)) {
      index++
    }
  }

  while (index < value.length) {
    const character = value[index]!
    if (/[a-z]/i.test(character)) {
      command = character.toLowerCase()
      index++
      skipWhitespace()
      if (command === 'z') {
        command = ''
        continue
      }
    }
    const parameterCount = PARAMETER_COUNTS.get(command)
    if (!parameterCount) {
      return false
    }
    for (let parameter = 0; parameter < parameterCount; parameter++) {
      if (command === 'a' && (parameter === 3 || parameter === 4)) {
        if (value[index] !== '0' && value[index] !== '1') {
          return false
        }
        index++
      } else {
        numberPattern.lastIndex = index
        const match = numberPattern.exec(value)
        if (!match || !Number.isFinite(Number(match[0]))) {
          return false
        }
        index = numberPattern.lastIndex
      }
      const separatorStart = index
      skipWhitespace()
      if (value[index] === ',') {
        index++
        skipWhitespace()
        // A comma must separate arguments, never commands or the end of data.
        if (index === value.length || /[a-z]/i.test(value[index]!)) {
          return false
        }
      }
      // Arc rotation and the first flag require a separator; the two flags
      // and the following coordinate can be concatenated (e.g. 0 0110 10).
      if (command === 'a' && parameter === 2 && index === separatorStart) {
        return false
      }
    }
  }
  return true
}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid path data in SVG path elements',
      recommended: true,
    },
    schema: [],
    messages: {
      invalid:
        'Path data must contain valid SVG commands and complete parameter groups',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Element(node) {
        if (getSvgElementName(node) !== 'path') {
          return
        }
        const attribute = node.attributes.find(attr => attr.key?.value === 'd')
        if (!attribute?.value) {
          return
        }
        const value = decodeXmlAttribute(attribute.value.value).replace(
          /^[\t\n\f\r ]+|[\t\n\f\r ]+$/g,
          '',
        )
        if (!isValidPathData(value)) {
          context.report({ node: attribute.value, messageId: 'invalid' })
        }
      },
    }
  },
})
