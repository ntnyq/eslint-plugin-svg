import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/prefer-current-color'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/prefer-current-color'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'current-color.svg',
      code: $`
        <svg>
          <path fill="currentColor" stroke="currentColor" />
        </svg>
      `,
    },
    {
      filename: 'ignored-values.svg',
      code: $`
        <svg>
          <path fill="none" stroke="transparent" />
        </svg>
      `,
    },
    {
      filename: 'allow-colors-option.svg',
      options: [
        {
          allowColors: ['#000000'],
        },
      ],
      code: $`
        <svg>
          <path fill="#000000" />
        </svg>
      `,
    },
    {
      filename: 'non-color-value.svg',
      code: $`
        <svg>
          <path fill="url(#gradient)" />
        </svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'hex-color.svg',
      code: $`
        <svg>
          <path fill="#111111" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('invalid')
      },
    },
    {
      filename: 'named-color.svg',
      code: $`
        <svg>
          <path stroke="red" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('invalid')
      },
    },
    {
      filename: 'color-function.svg',
      code: $`
        <svg>
          <path fill="rgb(1, 2, 3)" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('invalid')
      },
    },
  ],
})
