import { dirname } from 'node:path'
import { transformerRenderWhitespace } from '@shikijs/transformers'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import pluginSVG from 'eslint-plugin-svg'
import MarkdownItContainer from 'markdown-it-container'
import ts from 'typescript'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { createExampleTransformers } from './config/examples.ts'
import { head } from './config/head.ts'
import { getThemeConfig } from './config/theme.ts'
import { appDescription, appTitle } from './meta.ts'

export default defineConfig({
  title: appTitle,
  description: appDescription,
  lastUpdated: true,
  cleanUrls: true,

  head,
  themeConfig: getThemeConfig(),
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)

      type MarkdownIt = Parameters<typeof MarkdownItContainer>[0]

      md.core.ruler.after('block', 'svg-rule-examples', state => {
        const title = state.env.frontmatter?.title
        const ruleName =
          typeof title === 'string' && title.startsWith('svg/')
            ? title.slice(4)
            : undefined

        if (!ruleName) {
          return
        }

        for (const token of state.tokens) {
          if (token.type === 'fence' && /^xml\b/.test(token.info)) {
            token.info += ` eslint-rule=${ruleName}`
          }
        }
      })

      MarkdownItContainer(md as unknown as MarkdownIt, 'correct', {
        render(tokens: any[], idx: number) {
          if (tokens[idx].nesting === 1) {
            return '<CustomWrapper type="correct">'
          }

          return '</CustomWrapper>\n'
        },
      })

      MarkdownItContainer(md as unknown as MarkdownIt, 'incorrect', {
        render(tokens: any[], idx: number) {
          if (tokens[idx].nesting === 1) {
            const next = tokens[idx + 1]

            if (next.type === 'fence') {
              next.info = [next.info, 'eslint-check'].filter(Boolean).join(' ')
            }

            return '<CustomWrapper type="incorrect">'
          }

          return '</CustomWrapper>\n'
        },
      })
    },

    codeTransformers: [
      transformerRenderWhitespace({
        position: 'all',
      }),
      transformerTwoslash({
        explicitTrigger: /\btwoslash\b/,
        twoslashOptions: {
          // The TS 6 compatibility wrapper re-exports the API but not lib files.
          tsLibDirectory: dirname(ts.getDefaultLibFilePath({})),
        },
      }),
      ...createExampleTransformers(pluginSVG),
    ],
  },
})
