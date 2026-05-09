import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/require-accessible-name'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'root-svg-with-title.svg',
      code: $`
        <svg>
          <title>Logo</title>
          <path d="M0 0h10v10z" />
        </svg>
      `,
    },
    {
      filename: 'root-svg-with-aria-label.svg',
      code: $`
        <svg aria-label="Search icon">
          <path d="M0 0h10v10z" />
        </svg>
      `,
    },
    {
      filename: 'nested-svg-without-role-img.svg',
      code: $`
        <svg aria-label="Outer icon set">
          <svg>
            <path d="M0 0h10v10z" />
          </svg>
        </svg>
      `,
    },
    {
      filename: 'role-img-svg-with-aria-labelledby.svg',
      code: $`
        <svg aria-label="Outer icon set">
          <g id="name">Icon Name</g>
          <svg role="img" aria-labelledby="name">
            <path d="M0 0h10v10z" />
          </svg>
        </svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'root-svg-missing-name.svg',
      code: $`
        <svg>
          <path d="M0 0h10v10z" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('missing')
      },
    },
    {
      filename: 'root-svg-empty-title.svg',
      code: $`
        <svg>
          <title>  </title>
          <path d="M0 0h10v10z" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('missing')
      },
    },
    {
      filename: 'role-img-svg-missing-name.svg',
      code: $`
        <svg aria-label="Outer icon set">
          <svg role="img">
            <path d="M0 0h10v10z" />
          </svg>
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('missing')
      },
    },
  ],
})
