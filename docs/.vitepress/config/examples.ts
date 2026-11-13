import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createTwoslasher } from 'twoslash-eslint'
import type { ShikiTransformer } from '@shikijs/types'
import type pluginSVG from 'eslint-plugin-svg'

type RuleName = keyof typeof pluginSVG.rules

/**
 * Lint a rule example as SVG using only the rule being documented.
 */
export function createExampleTwoslasher(
  plugin: typeof pluginSVG,
  ruleName: RuleName,
  options: unknown[] = [],
) {
  const lint = createTwoslasher({
    eslintCodePreprocess(code) {
      return code.replace(/⏎(?=\n)/gu, '').replace(/⏎$/gu, '\n')
    },
    eslintConfig: [
      {
        ...plugin.configs.recommended[0],
        rules: { [`svg/${ruleName}`]: ['error', ...options] },
      },
    ],
  })
  return (code: string) => lint(code, 'example.svg')
}

/**
 * Create independent transformers so page rendering never shares mutable rule state.
 */
export function createExampleTransformers(
  plugin: typeof pluginSVG,
): ShikiTransformer[] {
  const examples: Array<{
    rule: RuleName
    variant?: string
    options?: unknown[]
  }> = (Object.keys(plugin.rules) as RuleName[]).map(rule => ({
    rule,
    // This rule intentionally does nothing without the documented option.
    options: rule === 'no-elements' ? [{ elements: ['style', 'script'] }] : [],
  }))
  examples.push(
    {
      rule: 'no-base64-data-url',
      variant: 'any-data-url',
      options: [{ mode: 'any-data-url' }],
    },
    {
      rule: 'no-invalid-role',
      variant: 'list-only',
      options: [{ roles: ['list'] }],
    },
  )
  return examples.map(({ rule, variant, options }) =>
    transformerTwoslash({
      errorRendering: 'hover',
      explicitTrigger: /\beslint-check\b/,
      filter(lang, _code, highlightOptions) {
        const meta = highlightOptions.meta?.__raw ?? ''
        const exampleRule = meta.match(/\beslint-rule=([\w-]+)/)?.[1]
        const exampleVariant = meta.match(/\beslint-example=([\w-]+)/)?.[1]
        return (
          lang === 'xml'
          && /\beslint-check\b/.test(meta)
          && exampleRule === rule
          && exampleVariant === variant
        )
      },
      twoslasher: createExampleTwoslasher(plugin, rule, options),
    }),
  )
}
