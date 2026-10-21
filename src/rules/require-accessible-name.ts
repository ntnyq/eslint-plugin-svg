import {
  createESLintRule,
  decodeXmlReferences,
  getAttributeValue,
  getEffectiveRole,
  getParentElement,
  getSvgElementName,
} from '../utils'
import type { AST } from '../types'

export const RULE_NAME = 'require-accessible-name'
export type MessageIds = 'missing'
export type Options = []

/** Hidden SVGs, including descendants of aria-hidden ancestors, need no name. */
function isHidden(node: AST.ElementNode): boolean {
  let current: AST.ElementNode | undefined = node
  while (current) {
    if (
      getAttributeValue(current, 'aria-hidden').trim().toLowerCase() === 'true'
    ) {
      return true
    }
    current = getParentElement(current)
  }
  return false
}

function isPresentational(node: AST.ElementNode): boolean {
  const role = getEffectiveRole(getAttributeValue(node, 'role'))
  return (
    (role === 'none' || role === 'presentation')
    && !node.attributes.some(
      attribute =>
        attribute.key.value === 'tabindex'
        || attribute.key.value.startsWith('aria-'),
    )
    && getAttributeValue(node, 'focusable') !== 'true'
  )
}

/** Static text alternatives only; CSS and script-generated names are out of scope. */
function getContentName(node: AST.ElementNode, includeHidden = false): string {
  return node.children
    .map(child => {
      if (child.type === 'Text') {
        return decodeXmlReferences(child.value)
      }
      if (child.type === 'CDATA') {
        return child.value
      }
      if (child.type !== 'Element' || (!includeHidden && isHidden(child))) {
        return ''
      }
      if (['desc', 'script', 'style'].includes(child.name.split(':').at(-1)!)) {
        return ''
      }
      return (
        getOwnName(child, includeHidden) || getContentName(child, includeHidden)
      )
    })
    .join(' ')
    .trim()
}

function getOwnName(node: AST.ElementNode, includeHidden = false): string {
  const label = getAttributeValue(node, 'aria-label').trim()
  if (label) {
    return label
  }
  const title = node.children.find(
    child => child.type === 'Element' && getSvgElementName(child) === 'title',
  )
  return title?.type === 'Element' ? getContentName(title, includeHidden) : ''
}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require an accessible name for root svg elements and svg elements with role="img"',
      recommended: false,
    },
    schema: [],
    messages: {
      missing:
        'SVG element must provide an accessible name via <title>, aria-label, or aria-labelledby',
    },
  },
  defaultOptions: [],
  create(context) {
    const elementsById = new Map<string, AST.ElementNode>()
    const targets: AST.ElementNode[] = []

    function checkNames() {
      for (const node of targets) {
        if (isHidden(node) || isPresentational(node)) {
          continue
        }
        const references = getAttributeValue(node, 'aria-labelledby')
          .split(/[\t\n\r ]+/)
          .map(id => elementsById.get(id))
          .filter((element): element is AST.ElementNode => !!element)
        // Do not follow aria-labelledby on referenced nodes: chained and cyclic
        // references are not another labelledby traversal in the name algorithm.
        const name = references.length
          ? references
              .map(
                element =>
                  getOwnName(element, isHidden(element))
                  || getContentName(element, isHidden(element)),
              )
              .join(' ')
              .trim()
          : getOwnName(node)
        if (!name) {
          context.report({ node, messageId: 'missing' })
        }
      }
    }

    return {
      Element(node) {
        const id = getAttributeValue(node, 'id')
        if (id && !elementsById.has(id)) {
          elementsById.set(id, node)
        }
        if (
          getSvgElementName(node) === 'svg'
          && (!getParentElement(node)
            || getEffectiveRole(getAttributeValue(node, 'role')) === 'img')
        ) {
          targets.push(node)
        }
      },
      'Document:exit': checkNames,
    }
  },
})
