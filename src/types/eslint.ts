import type { Rule } from 'eslint'
import type { JSONSchema4 } from 'json-schema'
import type { SourceCode } from './sourceCode'
import type { AST } from './svg'

/**
 * Rule fixer
 */
export type Fix = {
  range: AST.Range
  text: string
}

/**
 * Rule meta related
 */
export interface NamedCreateRuleMeta<
  TMessageIds extends string,
  TDocs = unknown,
  TOptions extends readonly unknown[] = [],
> extends Omit<RuleMetaData<TMessageIds, TDocs, TOptions>, 'docs'> {
  docs: RuleMetaDataDocs & TDocs
}

export type ReportDescriptor<TMessageIds extends string> =
  ReportDescriptorWithSuggestion<TMessageIds>
    & (ReportDescriptorLocOnly | ReportDescriptorNodeOptionalLoc)

export type ReportDescriptorBase<TMessageIds extends string> = {
  readonly messageId: TMessageIds
  readonly data?: ReportDescriptorMessageData
  readonly fix?: ReportFixer
}
export type ReportDescriptorLocOnly = {
  loc: Readonly<AST.Position> | Readonly<AST.SourceLocation>
}
export type ReportDescriptorMessageData = Readonly<Record<string, unknown>>
export type ReportDescriptorNodeOptionalLoc = {
  readonly node: AST.AnyNode
  readonly loc?: Readonly<AST.Position> | Readonly<AST.SourceLocation>
}
export interface ReportDescriptorWithSuggestion<
  TMessageIds extends string,
> extends ReportDescriptorBase<TMessageIds> {
  readonly suggest?: readonly Rule.SuggestionReportDescriptor[]
}

export type ReportFixer = (
  fixer: RuleFixer,
) => Fix | Fix[] | IterableIterator<Fix> | null

export interface RuleContext<
  TMessageIds extends string,
  TOptions extends readonly unknown[] = [],
> {
  id: string
  options: TOptions
  parserPath: string
  settings: { svg?: SVGSettings; [name: string]: any }
  getFilename(): string
  getSourceCode(): SourceCode
  report(descriptor: ReportDescriptor<TMessageIds>): void
  parserServices?: {
    isSVG?: true
    parseError?: any
  }
}

export interface RuleCreateAndOptions<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
> {
  defaultOptions: Readonly<TOptions>
  create: (
    context: Readonly<RuleContext<TMessageIds, TOptions>>,
    optionsWithDefault: Readonly<TOptions>,
  ) => RuleListener
}
export type RuleFixer = {
  insertTextAfter(nodeOrToken: AST.AnyNode | AST.AnyToken, text: string): Fix

  insertTextAfterRange(range: AST.Range, text: string): Fix

  insertTextBefore(nodeOrToken: AST.AnyNode | AST.AnyToken, text: string): Fix

  insertTextBeforeRange(range: AST.Range, text: string): Fix

  remove(nodeOrToken: AST.AnyNode | AST.AnyToken): Fix

  removeRange(range: AST.Range): Fix

  replaceText(nodeOrToken: AST.AnyNode | AST.AnyToken, text: string): Fix

  replaceTextRange(range: AST.Range, text: string): Fix
}

export interface RuleListener {
  // attribute
  Attribute?: (node: AST.AttributeNode) => void
  'Attribute:exit'?: (node: AST.AttributeNode) => void

  // comment
  Comment?: (node: AST.CommentNode) => void
  'Comment:exit'?: (node: AST.CommentNode) => void

  // doctype
  Doctype?: (node: AST.DoctypeNode) => void
  'Doctype:exit'?: (node: AST.DoctypeNode) => void

  DoctypeAttribute?: (node: AST.DoctypeAttributeNode) => void
  'DoctypeAttribute:exit'?: (node: AST.DoctypeAttributeNode) => void

  // document
  Document?: (node: AST.DocumentNode) => void
  'Document:exit'?: (node: AST.DocumentNode) => void
  // program
  Program?: (node: AST.Program) => void
  'Program:exit'?: (node: AST.Program) => void

  // tag
  Tag?: (node: AST.TagNode) => void
  'Tag:exit'?: (node: AST.TagNode) => void

  // text
  Text?: (node: AST.TextNode) => void
  'Text:exit'?: (node: AST.TextNode) => void
  [key: string]: ((node: never) => void) | undefined
}
export interface RuleMetaData<
  TMessageIds extends string,
  TDocs = unknown,
  TOptions extends readonly unknown[] = [],
> {
  messages: Record<TMessageIds, string>
  schema: JSONSchema4 | readonly JSONSchema4[]
  type: 'layout' | 'problem' | 'suggestion'
  defaultOptions?: TOptions
  deprecated?: boolean
  docs?: RuleMetaDataDocs & TDocs
  fixable?: 'code' | 'whitespace'
  hasSuggestions?: boolean
  replacedBy?: readonly string[]
}
export interface RuleMetaDataDocs {
  description: string
  category?: string
  recommended?: boolean
  url?: string
}

export interface RuleModule<
  TMessageIds extends string,
  TOptions extends readonly unknown[] = [],
  TDocs = unknown,
> {
  defaultOptions: TOptions
  meta?: RuleMetaData<TMessageIds, TDocs, TOptions>
  create(context: RuleContext<TMessageIds, TOptions>): RuleListener
}
export interface RuleWithMeta<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
  TDocs = unknown,
> extends RuleCreateAndOptions<TOptions, TMessageIds> {
  meta: RuleMetaData<TMessageIds, TDocs, TOptions>
}
export interface RuleWithMetaAndName<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
  TDocs = unknown,
> extends RuleCreateAndOptions<TOptions, TMessageIds> {
  meta: NamedCreateRuleMeta<TMessageIds, TDocs, TOptions>
  name: string
}
type SVGSettings = { indent?: number }
