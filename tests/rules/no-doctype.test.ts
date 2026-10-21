import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-doctype'
import { $, run } from '../internal'
import type { InvalidTestCase } from 'eslint-vitest-rule-tester'
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
    ...[
      '<!DOCTYPE svg [<!ENTITY name "Logo">]><svg><text>&name;</text></svg>',
      '<!DOCTYPE svg [<!ATTLIST svg fill CDATA "red">]><svg/>',
      '<!DOCTYPE svg []><svg/>',
      '<!DOCTYPE svg SYSTEM "custom.dtd"><svg><text>&name;</text></svg>',
      '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg/>',
    ].map<InvalidTestCase<Options>>(code => ({
      filename: 'preserve-dtd.svg',
      code,
      output: null,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('invalid')
        expect(errors[0]).not.toHaveProperty('fix')
      },
    })),
    {
      filename: 'doctype.svg',
      code: $`
        <!DOCTYPE svg>
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
              "endColumn": 15,
              "endLine": 1,
              "fix": {
                "range": [
                  0,
                  14,
                ],
                "text": "",
              },
              "line": 1,
              "message": "Doctype is not allowed",
              "messageId": "invalid",
              "ruleId": "no-doctype",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
