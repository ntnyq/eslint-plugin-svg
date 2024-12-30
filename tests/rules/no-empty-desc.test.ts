import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-empty-desc'
import { $, run } from '../internal'

run({
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
              "endColumn": 14,
              "endLine": 2,
              "line": 2,
              "message": "Element desc must not be empty",
              "messageId": "invalid",
              "nodeType": "Tag",
              "ruleId": "no-empty-desc",
              "severity": 2,
            },
          ]
        `)
      },
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
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 8,
              "endLine": 4,
              "line": 2,
              "message": "Element desc must not be empty",
              "messageId": "invalid",
              "nodeType": "Tag",
              "ruleId": "no-empty-desc",
              "severity": 2,
            },
          ]
        `)
      },
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
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 8,
              "endLine": 4,
              "line": 2,
              "message": "Element desc must not be empty",
              "messageId": "invalid",
              "nodeType": "Tag",
              "ruleId": "no-empty-desc",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
