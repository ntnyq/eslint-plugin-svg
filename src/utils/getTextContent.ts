import { decodeXmlReferences } from './xml'

interface TextNode {
  type: 'Text' | 'CDATA'
  value: string
}

interface CommentNode {
  type: 'Comment'
}

interface ElementNode {
  type: 'Element'
  children: ChildNode[]
}

type ChildNode = TextNode | CommentNode | ElementNode | { type: string }

interface TextContainerNode {
  children: ChildNode[]
}

export interface GetTextContentOptions {
  /**
   * whether comment nodes should be ignored
   *
   * @default true
   */
  ignoreComments?: boolean
  /**
   * whether text nodes should be trimmed and empty chunks removed
   *
   * @default true
   */
  ignoreWhitespace?: boolean
}

const defaultOptions: Required<GetTextContentOptions> = {
  ignoreComments: true,
  ignoreWhitespace: true,
}

/**
 * Recursively collect text segments from a tree-like node.
 */
function collectText(
  node: TextContainerNode,
  options: Required<GetTextContentOptions>,
): string[] {
  const textSegments: string[] = []

  for (const child of node.children) {
    if (child.type === 'Comment' && options.ignoreComments) {
      continue
    }

    if ((child.type === 'Text' || child.type === 'CDATA') && 'value' in child) {
      const text =
        child.type === 'Text' ? decodeXmlReferences(child.value) : child.value
      const value = options.ignoreWhitespace ? text.trim() : text
      if (value) {
        textSegments.push(value)
      }
      continue
    }

    if (child.type === 'Element' && 'children' in child) {
      textSegments.push(...collectText(child, options))
    }
  }

  return textSegments
}

/**
 * Get joined text content from a node tree.
 */
export function getTextContent(
  node: TextContainerNode,
  options: GetTextContentOptions = {},
): string {
  const resolvedOptions = {
    ...defaultOptions,
    ...options,
  }

  return collectText(node, resolvedOptions).join(' ')
}
