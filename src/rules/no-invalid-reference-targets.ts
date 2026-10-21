import {
  createESLintRule,
  getAttributeValue,
  getLocalReferences,
  getParentElement,
  getSvgElementName,
  isHrefAttribute,
} from '../utils'
import type { AST } from '../types'
import type { LocalReference } from '../utils/references'

export const RULE_NAME = 'no-invalid-reference-targets'
export type MessageIds = 'invalid'
export type Options = []

const PAINT_SERVERS = ['linearGradient', 'radialGradient', 'pattern']
const GEOMETRY_ELEMENTS = [
  'circle',
  'ellipse',
  'line',
  'path',
  'polygon',
  'polyline',
  'rect',
]
const ATTRIBUTE_TARGETS: Record<string, string[]> = {
  'clip-path': ['clipPath'],
  fill: PAINT_SERVERS,
  filter: ['filter'],
  marker: ['marker'],
  'marker-end': ['marker'],
  'marker-mid': ['marker'],
  'marker-start': ['marker'],
  stroke: PAINT_SERVERS,
}
const HREF_TARGETS: Record<string, string[]> = {
  filter: ['filter'],
  linearGradient: ['linearGradient', 'radialGradient'],
  mpath: ['path'],
  pattern: ['pattern'],
  radialGradient: ['linearGradient', 'radialGradient'],
  textPath: GEOMETRY_ELEMENTS,
}

/**
 * Restrict checks to references with a statically known SVG target type.
 */
function isValidTarget(
  reference: LocalReference,
  target: AST.ElementNode,
): boolean {
  const { attribute } = reference
  const source = getParentElement(attribute)
  if (!source || !attribute.key) {
    return true
  }
  const sourceName = getSvgElementName(source) ?? ''
  const targetName = getSvgElementName(target)
  if (isHrefAttribute(attribute)) {
    if (sourceName === 'use') {
      return targetName !== null
    }
    const targets = Object.hasOwn(HREF_TARGETS, sourceName)
      ? HREF_TARGETS[sourceName]
      : undefined
    if (!targets) {
      return true
    }
    return target !== source && targets.includes(targetName ?? '')
  }
  const targets = ATTRIBUTE_TARGETS[attribute.key.value]
  return !targets || targets.includes(targetName ?? '')
}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow SVG references to elements of an invalid type',
      recommended: true,
    },
    schema: [],
    messages: {
      invalid:
        "Reference to '{{id}}' in attribute '{{name}}' cannot target element '{{target}}'",
    },
  },
  defaultOptions: [],
  create(context) {
    const elementsById = new Map<string, AST.ElementNode>()
    const references: LocalReference[] = []
    return {
      Element(node) {
        const id = getAttributeValue(node, 'id')
        if (id && !elementsById.has(id)) {
          elementsById.set(id, node)
        }
        references.push(...getLocalReferences(node))
      },
      'Document:exit': function () {
        for (const reference of references) {
          const target = elementsById.get(reference.id)
          // Missing IDs belong to no-unresolved-references.
          if (target && !isValidTarget(reference, target)) {
            context.report({
              node: reference.attribute,
              messageId: 'invalid',
              data: {
                id: reference.id,
                name: reference.attribute.key?.value,
                target: target.name,
              },
            })
          }
        }
      },
    }
  },
})
