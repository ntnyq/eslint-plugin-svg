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

type ContentNameCache = WeakMap<AST.ElementNode, [string?, string?]>

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
        attribute.key?.value === 'tabindex'
        || attribute.key?.value.startsWith('aria-'),
    )
    && getAttributeValue(node, 'focusable') !== 'true'
  )
}

/** Static text alternatives only; CSS and script-generated names are out of scope. */
function getContentName(
  node: AST.ElementNode,
  includeHidden: boolean,
  cache: ContentNameCache,
): string {
  const index = includeHidden ? 1 : 0
  const cached = cache.get(node)?.[index]
  if (cached !== undefined) {
    return cached
  }
  const name = node.children
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
        getOwnName(child, includeHidden, cache)
        || getContentName(child, includeHidden, cache)
      )
    })
    .join(' ')
    .trim()
  const names = cache.get(node) ?? []
  names[index] = name
  cache.set(node, names)
  return name
}

function getOwnName(
  node: AST.ElementNode,
  includeHidden: boolean,
  cache: ContentNameCache,
): string {
  const label = getAttributeValue(node, 'aria-label').trim()
  if (label) {
    return label
  }
  const title = node.children.find(
    child => child.type === 'Element' && getSvgElementName(child) === 'title',
  )
  return title?.type === 'Element'
    ? getContentName(title, includeHidden, cache)
    : ''
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
    // Empty alternatives can be visited via both title and content fallbacks.
    // Cache both visibility modes to avoid exponential subtree traversal.
    const contentNames: ContentNameCache = new WeakMap()

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
                  getOwnName(element, isHidden(element), contentNames)
                  || getContentName(element, isHidden(element), contentNames),
              )
              .join(' ')
              .trim()
          : getOwnName(node, false, contentNames)
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
