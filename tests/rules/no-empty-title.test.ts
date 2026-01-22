import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-empty-title'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'valid.svg',
      code: $`
        <svg>
          <title>foo</title>
        </svg>
      `,
    },
    {
      filename: 'title-no-text.svg',
      code: $`
        <svg>
          <title>
            <circle r="10" />
          </title>
        </svg>
      `,
    },
    {
      filename: 'title-comment.svg',
      code: $`
        <svg>
          <title>
            <!-- foobar -->
          </title>
        </svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'empty-title.svg',
      code: $`
        <svg>
          <title></title>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 18,
              "endLine": 2,
              "line": 2,
              "message": "Element title must not be empty",
              "messageId": "invalid",
              "nodeType": "Tag",
              "ruleId": "no-empty-title",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'empty-title.svg',
      code: $`
        <svg>
          <title>
          </title>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 11,
              "endLine": 3,
              "line": 2,
              "message": "Element title must not be empty",
              "messageId": "invalid",
              "nodeType": "Tag",
              "ruleId": "no-empty-title",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
