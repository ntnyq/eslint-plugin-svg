import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-empty-desc'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-empty-desc'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'valid.svg',
      code: $`
        <svg>
          <desc>foo</desc>
        </svg>
      `,
    },
    {
      filename: 'desc-no-text.svg',
      code: $`
        <svg>
          <desc>
            <circle r="10" />
          </desc>
        </svg>
      `,
    },
    {
      filename: 'desc-comment.svg',
      code: $`
        <svg>
          <desc>
            <!-- foobar -->
          </desc>
        </svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'empty-desc.svg',
      code: $`
        <svg>
          <desc></desc>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 16,
              "endLine": 2,
              "line": 2,
              "message": "Element desc must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-desc",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'empty-desc.svg',
      code: $`
        <svg>
          <desc>
          </desc>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 10,
              "endLine": 3,
              "line": 2,
              "message": "Element desc must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-desc",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
