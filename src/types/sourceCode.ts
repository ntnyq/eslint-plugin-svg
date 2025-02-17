import type { AST } from './svg'

export interface SourceCode {
  ast: AST.Program
  hasBOM: boolean
  lines: string[]
  text: string
  commentsExistBetween(left: SVGNodeOrToken, right: SVGNodeOrToken): boolean
  getAllComments(): AST.CommentNode[]

  getCommentsAfter(nodeOrToken: SVGNodeOrToken): AST.CommentNode[]

  getCommentsBefore(nodeOrToken: SVGNodeOrToken): AST.CommentNode[]

  getCommentsInside(node: AST.AnyNode): AST.CommentNode[]

  getFirstToken(node: AST.AnyNode): AST.AnyToken

  getIndexFromLoc(loc: AST.Position): number

  getLastToken(node: AST.AnyNode): AST.AnyToken

  getLastTokens(node: AST.AnyNode, options?: CursorWithCountOptions): SVGToken[]

  getLines(): string[]

  // Inherited methods from TokenStore
  // ---------------------------------

  getLocFromIndex(index: number): AST.Position

  getNodeByRangeIndex(index: number): AST.AnyNode | null
  getTokenAfter(node: SVGNodeOrToken): AST.AnyToken | null

  getTokenBefore(node: SVGNodeOrToken): AST.AnyToken | null

  isSpaceBetweenTokens(first: SVGToken, second: SVGToken): boolean
  visitorKeys: {
    [nodeType: string]: string[]
  }

  parserServices?: {
    isSVG?: true
    parseError?: any
  }

  getComments(node: SVGNodeOrToken): {
    leading: AST.CommentNode[]
    trailing: AST.CommentNode[]
  }
  getFirstToken(
    node: AST.AnyNode,
    options?: CursorWithSkipOptions,
  ): SVGToken | null

  getFirstTokenBetween(
    left: SVGNodeOrToken,
    right: SVGNodeOrToken,
    options?: CursorWithSkipOptions,
  ): SVGToken | null

  getFirstTokens(
    node: AST.AnyNode,
    options?: CursorWithCountOptions,
  ): SVGToken[]
  getFirstTokensBetween(
    left: SVGNodeOrToken,
    right: SVGNodeOrToken,
    options?: CursorWithCountOptions,
  ): SVGToken[]

  getLastToken(
    node: AST.AnyNode,
    options?: CursorWithSkipOptions,
  ): SVGToken | null

  getLastTokenBetween(
    left: SVGNodeOrToken,
    right: SVGNodeOrToken,
    options?: CursorWithSkipOptions,
  ): SVGToken | null

  getLastTokensBetween(
    left: SVGNodeOrToken,
    right: SVGNodeOrToken,
    options?: CursorWithCountOptions,
  ): SVGToken[]

  getText(
    node?: SVGNodeOrToken,
    beforeCount?: number,
    afterCount?: number,
  ): string

  getTokenAfter(
    node: SVGNodeOrToken,
    options?: CursorWithSkipOptions,
  ): SVGToken | null

  getTokenBefore(
    node: SVGNodeOrToken,
    options?: CursorWithSkipOptions,
  ): SVGToken | null

  getTokenByRangeStart(
    offset: number,
    options?: { includeComments?: boolean },
  ): SVGToken | null
  getTokens(
    node: AST.AnyNode,
    beforeCount?: number,
    afterCount?: number,
  ): SVGToken[]

  getTokens(
    node: AST.AnyNode,
    options: CursorWithCountOptions | FilterPredicate,
  ): SVGToken[]

  getTokensAfter(
    node: SVGNodeOrToken,
    options?: CursorWithCountOptions,
  ): SVGToken[]

  getTokensBefore(
    node: SVGNodeOrToken,
    options?: CursorWithCountOptions,
  ): SVGToken[]

  getTokensBetween(
    left: SVGNodeOrToken,
    right: SVGNodeOrToken,
    padding?: number | CursorWithCountOptions | FilterPredicate,
  ): SVGToken[]
}
type CursorWithCountOptions =
  | number
  | FilterPredicate
  | {
      count?: number
      filter?: FilterPredicate
      includeComments?: boolean
    }

type CursorWithSkipOptions =
  | number
  | FilterPredicate
  | {
      filter?: FilterPredicate
      includeComments?: boolean
      skip?: number
    }

type FilterPredicate = (tokenOrComment: SVGToken) => boolean

type SVGNodeOrToken = AST.AnyNode | AST.AnyToken
type SVGToken = AST.AnyToken | AST.CommentNode
