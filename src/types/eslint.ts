import type { Rule } from 'eslint'
import type { JSONSchema4 } from 'json-schema'
import type { SourceCode } from './sourceCode'
import type { AST } from './svg'

/**
 * Rule fixer
 */
export type Fix = {
  /** source range to mutate */
  range: AST.Range
  /** replacement text */
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
  /** documentation metadata merged into rule meta */
  docs: RuleMetaDataDocs & TDocs
}

export type ReportDescriptor<TMessageIds extends string> =
  ReportDescriptorWithSuggestion<TMessageIds>
    & (ReportDescriptorLocOnly | ReportDescriptorNodeOptionalLoc)

export type ReportDescriptorBase<TMessageIds extends string> = {
  /** message key in `meta.messages` */
  readonly messageId: TMessageIds
  /** placeholder values for message interpolation */
  readonly data?: ReportDescriptorMessageData
  /** autofix callback */
  readonly fix?: ReportFixer
}
export type ReportDescriptorLocOnly = {
  /** explicit report location */
  loc: Readonly<AST.Position> | Readonly<AST.SourceLocation>
}
export type ReportDescriptorMessageData = Readonly<Record<string, unknown>>
export type ReportDescriptorNodeOptionalLoc = {
  /** node to report */
  readonly node: AST.AnyNode
  /** optional explicit location override */
  readonly loc?: Readonly<AST.Position> | Readonly<AST.SourceLocation>
}
export interface ReportDescriptorWithSuggestion<
  TMessageIds extends string,
> extends ReportDescriptorBase<TMessageIds> {
  /** quick-fix suggestions */
  readonly suggest?: readonly Rule.SuggestionReportDescriptor[]
}

export type ReportFixer = (
  fixer: RuleFixer,
) => Fix | Fix[] | IterableIterator<Fix> | null

export interface RuleContext<
  TMessageIds extends string,
  TOptions extends readonly unknown[] = [],
> {
  /** rule id */
  id: string
  /** normalized options */
  options: TOptions
  /** parser path in current lint run */
  parserPath: string
  /** ESLint settings */
  settings: { svg?: SVGSettings; [name: string]: any }
  /** return file path */
  getFilename(): string
  /** return source wrapper */
  getSourceCode(): SourceCode
  /** emit lint report */
  report(descriptor: ReportDescriptor<TMessageIds>): void
  /** parser specific services */
  parserServices?: {
    /** whether parser parsed SVG */
    isSVG?: true
    /** parser error details, if any */
    parseError?: any
  }
}

export interface RuleCreateAndOptions<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
> {
  /** default options used by the rule */
  defaultOptions: Readonly<TOptions>
  /** rule create callback */
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

  // element
  Element?: (node: AST.ElementNode) => void
  'Element:exit'?: (node: AST.ElementNode) => void

  // program
  Program?: (node: AST.Program) => void
  'Program:exit'?: (node: AST.Program) => void

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
  /** rule metadata */
  messages: Record<TMessageIds, string>
  /** option schema */
  schema: JSONSchema4 | readonly JSONSchema4[]
  /** rule category */
  type: 'layout' | 'problem' | 'suggestion'
  /** default options */
  defaultOptions?: TOptions
  /** deprecated flag */
  deprecated?: boolean
  /** docs metadata */
  docs?: RuleMetaDataDocs & TDocs
  /** autofix capability */
  fixable?: 'code' | 'whitespace'
  /** has suggestions flag */
  hasSuggestions?: boolean
  /** replacement rule ids */
  replacedBy?: readonly string[]
}
export interface RuleMetaDataDocs {
  /** rule description */
  description: string
  /** optional category */
  category?: string
  /** whether recommended */
  recommended?: boolean
  /** docs page URL */
  url?: string
}

export interface RuleWithMeta<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
  TDocs = unknown,
> extends RuleCreateAndOptions<TOptions, TMessageIds> {
  /** metadata and docs */
  meta: RuleMetaData<TMessageIds, TDocs, TOptions>
}
export interface RuleWithMetaAndName<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
  TDocs = unknown,
> extends RuleCreateAndOptions<TOptions, TMessageIds> {
  /** metadata and docs with name */
  meta: NamedCreateRuleMeta<TMessageIds, TDocs, TOptions>
  /** canonical rule name */
  name: string
}
type SVGSettings = {
  /** optional indentation size */
  indent?: number
}
