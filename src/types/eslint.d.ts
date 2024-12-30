import type { Rule } from 'eslint'
import type { JSONSchema4 } from 'json-schema'
import type { SourceCode } from './sourceCode'
import type { AST } from './svg'

export type ReportDescriptor<TMessageIds extends string> =
  ReportDescriptorWithSuggestion<TMessageIds> &
    (ReportDescriptorLocOnly | ReportDescriptorNodeOptionalLoc)

export type ReportDescriptorBase<TMessageIds extends string> = {
  readonly messageId: TMessageIds
  readonly data?: ReportDescriptorMessageData
  readonly fix?: Rule.ReportFixer
}

export type ReportDescriptorLocOnly = {
  loc: Readonly<AST.Position> | Readonly<AST.SourceLocation>
}

export type ReportDescriptorMessageData = Readonly<Record<string, unknown>>
export type ReportDescriptorNodeOptionalLoc = {
  readonly node: AST.AnyNode
  readonly loc?: Readonly<AST.Position> | Readonly<AST.SourceLocation>
}

export interface ReportDescriptorWithSuggestion<TMessageIds extends string>
  extends ReportDescriptorBase<TMessageIds> {
  readonly suggest?: readonly Rule.SuggestionReportDescriptor[]
}
export interface RuleContext<TMessageIds extends string, TOptions extends readonly unknown[] = []> {
  id: string
  options: TOptions
  parserPath: string
  settings: { yml?: YMLSettings; [name: string]: any }
  getAncestors(): AST.AnyNode[]
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
export interface RuleListener {
  Program?: (node: AST.Program) => void
  'Program:exit'?: (node: AST.Program) => void
  [key: string]: ((node: never) => void) | undefined
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

type YMLSettings = { indent?: number }

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
