import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/prefer-current-color'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/prefer-current-color'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'encoded-keywords.svg',
      code: '<svg fill="current&#67;olor" stroke="n&#111;ne"/>',
    },
    {
      filename: 'encoded-allowed-color.svg',
      code: '<svg fill="&#35;fff"/>',
      options: [{ allowColors: ['#fff'] }],
    },
    {
      filename: 'encoded-ignored-color.svg',
      code: '<svg stroke="r&#101;d"/>',
      options: [{ ignoreValues: ['red'] }],
    },
    {
      filename: 'decode-once.svg',
      code: '<svg fill="&amp;#35;fff"/>',
    },
    {
      filename: 'regression.svg',
      code: '<svg fill="inherit" stroke="inherit"/>',
    },
    {
      filename: 'regression.svg',
      code: '<svg fill="initial" stroke="initial"/>',
    },
    { filename: 'regression.svg', code: '<svg fill="unset" stroke="unset"/>' },
    {
      filename: 'regression.svg',
      code: '<svg fill="revert" stroke="revert"/>',
    },
    {
      filename: 'regression.svg',
      code: '<svg fill="revert-layer" stroke="revert-layer"/>',
    },
    {
      filename: 'regression.svg',
      code: '<svg fill="context-fill" stroke="context-fill"/>',
    },
    {
      filename: 'regression.svg',
      code: '<svg fill="context-stroke" stroke="context-stroke"/>',
    },
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
    ...[
      '<svg fill="&#35;fff"/>',
      '<svg stroke="r&#101;d"/>',
      '<svg fill="r&#103;b(1, 2, 3)"/>',
    ].map(code => ({
      filename: 'encoded-color.svg',
      code,
      errors: ['invalid'],
    })),
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
