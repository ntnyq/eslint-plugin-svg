import {
  createESLintRule,
  decodeXmlAttribute,
  getParentElement,
} from '../utils'

export const RULE_NAME = 'require-xmlns'
export type MessageIds = 'missing' | 'invalid'
export type Options = []

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description:
        'require the SVG namespace declaration on standalone SVG roots',
      recommended: false,
    },
    schema: [],
    messages: {
      missing:
        'Root SVG element must declare \'{{name}}="http://www.w3.org/2000/svg"\'',
      invalid: "Namespace '{{name}}' must be 'http://www.w3.org/2000/svg'",
    },
  },
  defaultOptions: [],
  create(context) {
    // The same parser may be used on fragments or processor-extracted markup.
    if (!/\.svg$/i.test(context.filename)) {
      return {}
    }
    return {
      Element(node) {
        if (getParentElement(node) || node.name.split(':').at(-1) !== 'svg') {
          return
        }
        const separator = node.name.indexOf(':')
        const name =
          separator === -1 ? 'xmlns' : `xmlns:${node.name.slice(0, separator)}`
        const attribute = node.attributes.find(attr => attr.key?.value === name)
        if (!attribute) {
          context.report({ node, messageId: 'missing', data: { name } })
        } else if (
          decodeXmlAttribute(attribute.value?.value ?? '') !== SVG_NAMESPACE
        ) {
          context.report({
            node: attribute,
            messageId: 'invalid',
            data: { name },
          })
        }
      },
    }
  },
})
