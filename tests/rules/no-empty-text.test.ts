import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-empty-text'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'valid.svg',
      code: $`
        <svg>
          <text>foo</text>
        </svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'empty-text.svg',
      code: $`
        <svg>
          <text></text>
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
              "message": "Element text must not be empty",
              "messageId": "invalid",
              "nodeType": "Tag",
              "ruleId": "no-empty-text",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'text-comment.svg',
      code: $`
        <svg>
          <text>
            <!-- foobar -->
          </text>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 10,
              "endLine": 4,
              "line": 2,
              "message": "Element text must not be empty",
              "messageId": "invalid",
              "nodeType": "Tag",
              "ruleId": "no-empty-text",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'text-no-text.svg',
      code: $`
        <svg>
          <text>
            <circle r="10" />
          </text>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 10,
              "endLine": 4,
              "line": 2,
              "message": "Element text must not be empty",
              "messageId": "invalid",
              "nodeType": "Tag",
              "ruleId": "no-empty-text",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
