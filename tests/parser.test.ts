import { Linter } from 'eslint'
import * as parserSVG from 'svg-eslint-parser'
import { expect, it } from 'vitest'
import plugin from '../src'

it.each(['javascript:alert(1)', 'data:image/png;base64,AAAA', 'red', 'img'])(
  'ignores recovered nameless attributes containing %s',
  value => {
    const messages = new Linter().verify(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" aria-label="Icon" ="${value}"><path d="M0 0L10 10"/></svg>`,
      [
        {
          files: ['**/*.svg'],
          languageOptions: {
            parser: parserSVG,
            parserOptions: { errorRecovery: true },
          },
          plugins: { svg: plugin },
          rules: Object.fromEntries(
            Object.keys(plugin.rules).map(name => [`svg/${name}`, 'error']),
          ),
        },
      ],
      { filename: 'recovered.svg' },
    )
    expect(messages).toEqual([])
  },
)
