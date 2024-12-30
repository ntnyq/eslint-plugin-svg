import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-empty-desc'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [],
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
              "column": 1,
              "endColumn": 5,
              "endLine": 3,
              "line": 1,
              "message": "",
              "messageId": "invalid",
              "nodeType": "Program",
              "ruleId": "no-empty-desc",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
