import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-empty-title'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [],
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
              "column": 1,
              "endColumn": 5,
              "endLine": 3,
              "line": 1,
              "message": "",
              "messageId": "invalid",
              "nodeType": "Program",
              "ruleId": "no-empty-title",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
