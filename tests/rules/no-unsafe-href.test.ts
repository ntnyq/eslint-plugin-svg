import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-unsafe-href'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'safe-fragment-reference.svg',
      code: $`
        <svg>
          <use href="#icon" />
        </svg>
      `,
    },
    {
      filename: 'safe-local-path.svg',
      code: $`
        <svg xmlns:xlink="http://www.w3.org/1999/xlink">
          <image xlink:href="./icons.svg#logo" />
        </svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'javascript-href.svg',
      code: $`
        <svg>
          <a href="javascript:alert(1)" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('invalid')
      },
    },
    {
      filename: 'remote-href.svg',
      code: $`
        <svg>
          <use href="http://example.com/icons.svg#id" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('invalid')
      },
    },
    {
      filename: 'data-xlink-href.svg',
      code: $`
        <svg xmlns:xlink="http://www.w3.org/1999/xlink">
          <image xlink:href="data:image/png;base64,AAA=" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('invalid')
      },
    },
  ],
})
