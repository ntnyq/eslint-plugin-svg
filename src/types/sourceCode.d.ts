import type { AST } from './svg'

export interface SourceCode {
  ast: AST.Program
  hasBOM: boolean
  lines: string[]
  text: string
  getAllComments(): AST.CommentNode[]
  getIndexFromLoc(loc: AST.Position): number

  getLines(): string[]

  getLocFromIndex(index: number): AST.Position

  getNodeByRangeIndex(index: number): AST.AnyNode | null

  getText(node?: SVGNodeOrToken, beforeCount?: number, afterCount?: number): string

  isSpaceBetweenTokens(first: SVGToken, second: SVGToken): boolean

  visitorKeys: {
    [nodeType: string]: string[]
  }

  parserServices?: {
    isSVG?: true
    parseError?: any
  }

  getComments(node: SVGNodeOrToken): {
    leading: AST.Comment[]
    trailing: AST.Comment[]
  }

  // Inherited methods from TokenStore
  // ---------------------------------

  commentsExistBetween(left: SVGNodeOrToken, right: SVGNodeOrToken): boolean

  getCommentsAfter(nodeOrToken: SVGNodeOrToken): AST.Comment[]
  getCommentsBefore(nodeOrToken: SVGNodeOrToken): AST.Comment[]

  getCommentsInside(node: AST.AnyNode): AST.Comment[]

  getFirstToken(node: AST.AnyNode): AST.Token
  getFirstToken(node: AST.AnyNode, options?: CursorWithSkipOptions): SVGToken | null

  getFirstTokens(node: AST.AnyNode, options?: CursorWithCountOptions): SVGToken[]

  getLastToken(node: AST.AnyNode): AST.Token
  getLastToken(node: AST.AnyNode, options?: CursorWithSkipOptions): SVGToken | null

  getLastTokens(node: AST.AnyNode, options?: CursorWithCountOptions): SVGToken[]

  getTokenAfter(node: SVGNodeOrToken): AST.Token | null
  getTokenAfter(node: SVGNodeOrToken, options?: CursorWithSkipOptions): SVGToken | null

  getTokenBefore(node: SVGNodeOrToken): AST.Token | null

  getTokenBefore(node: SVGNodeOrToken, options?: CursorWithSkipOptions): SVGToken | null

  getTokenByRangeStart(offset: number, options?: { includeComments?: boolean }): SVGToken | null

  getTokens(node: AST.AnyNode, beforeCount?: number, afterCount?: number): SVGToken[]

  getTokens(node: AST.AnyNode, options: CursorWithCountOptions | FilterPredicate): SVGToken[]

  getTokensAfter(node: SVGNodeOrToken, options?: CursorWithCountOptions): SVGToken[]

  getTokensBefore(node: SVGNodeOrToken, options?: CursorWithCountOptions): SVGToken[]
  getFirstTokenBetween(
    left: SVGNodeOrToken,
    right: SVGNodeOrToken,
    options?: CursorWithSkipOptions,
  ): SVGToken | null

  getFirstTokensBetween(
    left: SVGNodeOrToken,
    right: SVGNodeOrToken,
    options?: CursorWithCountOptions,
  ): SVGToken[]

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
