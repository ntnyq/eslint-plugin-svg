interface TextNode {
  type: 'Text'
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
  ignoreComments?: boolean
  ignoreWhitespace?: boolean
}

const defaultOptions: Required<GetTextContentOptions> = {
  ignoreComments: true,
  ignoreWhitespace: true,
}

function collectText(
  node: TextContainerNode,
  options: Required<GetTextContentOptions>,
): string[] {
  const textSegments: string[] = []

  for (const child of node.children) {
    if (child.type === 'Comment' && options.ignoreComments) {
      continue
    }

    if (child.type === 'Text' && 'value' in child) {
      const value = options.ignoreWhitespace ? child.value.trim() : child.value
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
