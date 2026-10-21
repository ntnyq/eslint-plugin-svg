import type { AST } from '../types'

const XML_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  quot: '"',
}

/** Decode XML references once; never expand document-defined entities. */
export function decodeXmlReferences(value: string): string {
  return value.replace(
    /&(#x[\da-f]+|#\d+|amp|apos|gt|lt|quot);/gi,
    (match: string, reference: string) => {
      if (!reference.startsWith('#')) {
        return XML_ENTITIES[reference] ?? match
      }
      const codePoint = reference.startsWith('#x')
        ? Number.parseInt(reference.slice(2), 16)
        : Number(reference.slice(1))
      if (
        codePoint === 9
        || codePoint === 10
        || codePoint === 13
        || (codePoint >= 0x20 && codePoint <= 0xd7ff)
        || (codePoint >= 0xe000 && codePoint <= 0xfffd)
        || (codePoint >= 0x10000 && codePoint <= 0x10ffff)
      ) {
        return String.fromCodePoint(codePoint)
      }
      return match
    },
  )
}

/** XML normalizes literal attribute whitespace before expanding references. */
export function decodeXmlAttribute(value: string): string {
  return decodeXmlReferences(
    value.replace(/\r\n?/g, '\n').replace(/[\t\n]/g, ' '),
  )
}

export function getParentElement(
  node: AST.AnyNode,
): AST.ElementNode | undefined {
  const parent = (node as AST.AnyNode & { parent?: AST.AnyNode }).parent
  return parent?.type === 'Element' ? parent : undefined
}

export function getAttributeValue(node: AST.ElementNode, name: string): string {
  return decodeXmlAttribute(
    node.attributes.find(attribute => attribute.key?.value === name)?.value
      ?.value ?? '',
  )
}

/** Resolve the closest namespace declaration, including prefix rebinding. */
export function resolveNamespace(
  node: AST.ElementNode,
  prefix: string,
): string | undefined {
  const name = prefix ? `xmlns:${prefix}` : 'xmlns'
  let current: AST.ElementNode | undefined = node
  while (current) {
    const attribute = current.attributes.find(
      attribute => attribute.key?.value === name,
    )
    if (attribute) {
      return decodeXmlAttribute(attribute.value?.value ?? '')
    }
    current = getParentElement(current)
  }
  return undefined
}

/** Unqualified SVG fragments remain supported; explicit foreign namespaces do not. */
export function getSvgElementName(node: AST.ElementNode): string | null {
  const separator = node.name.indexOf(':')
  const prefix = separator === -1 ? '' : node.name.slice(0, separator)
  const namespace = resolveNamespace(node, prefix)
  if (namespace === undefined) {
    return node.name
  }
  return namespace === 'http://www.w3.org/2000/svg'
    ? node.name.slice(separator + 1)
    : null
}

/** Recognize XLink aliases without treating other namespaced hrefs as XLink. */
export function isHrefAttribute(node: AST.AttributeNode): boolean {
  if (!node.key) {
    return false
  }
  if (node.key.value === 'href') {
    return true
  }
  const [prefix, name] = node.key.value.split(':')
  const parent = getParentElement(node)
  if (name !== 'href' || !parent) {
    return false
  }
  const namespace = resolveNamespace(parent, prefix)
  return (
    namespace === 'http://www.w3.org/1999/xlink'
    || (prefix === 'xlink' && namespace === undefined)
  )
}
