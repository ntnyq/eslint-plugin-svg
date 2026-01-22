import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-doctype'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-doctype'

run<Options>({
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
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "
          <svg>
            <text>foo</text>
          </svg>"
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 99,
              "endLine": 1,
              "fix": {
                "range": [
                  0,
                  98,
                ],
                "text": "",
              },
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
