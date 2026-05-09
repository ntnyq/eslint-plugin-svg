import { isNonEmptyString, toArray } from '@ntnyq/utils'
import { createESLintRule, getTextContent } from '../utils'
import type { AST } from '../types'

export const RULE_NAME = 'require-accessible-name'
export type MessageIds = 'missing'
export type Options = []

/**
 * Normalize values for case-insensitive attribute checks.
 */
function normalize(value: string): string {
  return value.trim().toLowerCase()
}

/**
 * Read a string attribute value by name from an SVG element.
 */
function getAttributeValue(
  attributes: AST.AttributeNode[],
  name: string,
): string | null {
  const target = normalize(name)
  const attr = attributes.find(node => normalize(node.key.value) === target)

  return attr?.value?.value ?? null
}

/**
 * Check whether the current SVG element contains a non-empty <title> child.
 */
function hasNonEmptyTitle(node: AST.ElementNode): boolean {
  const children = toArray(node.children)

  return children.some(child => {
    if (child.type !== 'Element' || child.name !== 'title') {
      return false
    }

    const textContent = getTextContent(child, {
      ignoreComments: true,
      ignoreWhitespace: true,
    })

    return isNonEmptyString(textContent.trim())
  })
}

/**
 * Detect whether the svg node is the root element in the document.
 */
function isRootSvg(node: AST.ElementNode): boolean {
  const nodeWithParent = node as AST.ElementNode & {
    parent?: AST.AnyNode
  }

  return nodeWithParent.parent?.type === 'Document'
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
    return {
      Element(node) {
        if (node.name !== 'svg') {
          return
        }

        const attributes = toArray(node.attributes)
        const role = getAttributeValue(attributes, 'role')
        const isRoleImg = normalize(role ?? '') === 'img'

        if (!isRootSvg(node) && !isRoleImg) {
          return
        }

        const ariaLabel = getAttributeValue(attributes, 'aria-label')
        const ariaLabelledBy = getAttributeValue(attributes, 'aria-labelledby')
        const hasTitle = hasNonEmptyTitle(node)

        if (
          hasTitle
          || isNonEmptyString(ariaLabel?.trim() ?? '')
          || isNonEmptyString(ariaLabelledBy?.trim() ?? '')
        ) {
          return
        }

        context.report({
          node,
          messageId: 'missing',
        })
      },
    }
  },
})
