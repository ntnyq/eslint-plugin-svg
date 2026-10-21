import {
  createESLintRule,
  decodeXmlAttribute,
  getAttributeValue,
  getSvgElementName,
  isHrefAttribute,
  resolveNamespace,
  SVG_HREF_ELEMENTS,
} from '../utils'
import type { AST } from '../types'

export const RULE_NAME = 'prefer-href'
export type MessageIds = 'deprecated'
export type Options = []

const ANIMATION_ELEMENTS = new Set([
  'animate',
  'animateColor',
  'animateTransform',
  'set',
])

/**
 * Adding href can override an animated XLink href; keep those migrations manual.
 */
function animatesHref(node: AST.ElementNode): boolean {
  if (!ANIMATION_ELEMENTS.has(getSvgElementName(node) ?? '')) {
    return false
  }
  const name = getAttributeValue(node, 'attributeName').trim()
  if (name === 'href') {
    return true
  }
  const [prefix, localName] = name.split(':')
  const namespace = resolveNamespace(node, prefix)
  return (
    localName === 'href'
    && (namespace === 'http://www.w3.org/1999/xlink'
      || (prefix === 'xlink' && namespace === undefined))
  )
}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require href instead of deprecated XLink href attributes',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      deprecated: "Use 'href' instead of deprecated '{{name}}'",
    },
  },
  defaultOptions: [],
  create(context) {
    const targets: AST.ElementNode[] = []
    let hasHrefAnimation = false
    return {
      Element(node) {
        hasHrefAnimation ||= animatesHref(node)
        if (SVG_HREF_ELEMENTS.has(getSvgElementName(node) ?? '')) {
          targets.push(node)
        }
      },
      'Document:exit': function () {
        for (const node of targets) {
          reportAttributes(node)
        }
      },
    }

    function reportAttributes(node: AST.ElementNode) {
      const href = node.attributes.find(
        attribute => attribute.key?.value === 'href',
      )
      const xlinkAttributes = node.attributes.filter(
        attribute =>
          attribute.key?.value !== 'href' && isHrefAttribute(attribute),
      )
      for (const attribute of xlinkAttributes) {
        const key = attribute.key
        if (!key) {
          continue
        }
        context.report({
          node: key,
          messageId: 'deprecated',
          data: { name: key.value },
          fix(fixer) {
            if (hasHrefAnimation) {
              return null
            }
            if (!href) {
              // Multiple aliases have no unambiguous migration order.
              return xlinkAttributes.length === 1
                ? fixer.replaceText(key, 'href')
                : null
            }
            if (
              href.value
              && attribute.value
              && decodeXmlAttribute(href.value.value)
                === decodeXmlAttribute(attribute.value.value)
            ) {
              return fixer.remove(attribute)
            }
            return null
          },
        })
      }
    }
  },
})
