import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-unknown-elements'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'known-elements.svg',
      code: $`
        <svg>
          <defs>
            <linearGradient id="g">
              <stop offset="0%" />
            </linearGradient>
          </defs>
          <rect fill="url(#g)" />
        </svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'unknown-elements.svg',
      code: $`
        <svg>
          <custom-node />
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('invalid')
      },
    },
  ],
})
