import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-doctype'
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
      filename: 'doctype.svg',
      code: $`
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
        <svg>
          <text>foo</text>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 97,
              "endLine": 1,
              "line": 1,
              "message": "Doctype is not allowed",
              "messageId": "invalid",
              "nodeType": "Doctype",
              "ruleId": "no-doctype",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
