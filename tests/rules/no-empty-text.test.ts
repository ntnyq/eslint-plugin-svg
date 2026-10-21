import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-empty-text'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-empty-text'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'cdata-text.svg',
      code: '<svg><text><![CDATA[Logo]]></text></svg>',
    },
    {
      filename: 'literal-cdata.svg',
      code: '<svg><text><![CDATA[&#32;]]></text></svg>',
    },
    {
      filename: 'decode-once.svg',
      code: '<svg><text>&amp;#32;</text></svg>',
    },
    {
      filename: 'namespaces.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:text>Logo</s:text></s:svg>',
    },
    {
      filename: 'valid.svg',
      code: $`
        <svg>
          <text>foo</text>
        </svg>
      `,
    },
    {
      filename: 'text-with-tspan-text.svg',
      code: $`
        <svg>
          <text>
            <tspan>foo</tspan>
          </text>
        </svg>
      `,
    },
  ],
  invalid: [
    ...[
      '<svg><text>&#32;&#9;</text></svg>',
      '<svg><text><tspan>&#x20;&#10;</tspan></text></svg>',
      '<svg><text><![CDATA[   ]]></text></svg>',
    ].map(code => ({
      filename: 'empty-content.svg',
      code,
      errors: ['invalid'],
    })),
    {
      filename: 'namespaces.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:text/></s:svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
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
              "ruleId": "no-empty-text",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'empty-text.svg',
      code: $`
        <svg>
          <text>
          </text>
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
              "message": "Element text must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-text",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'text-no-readable-text.svg',
      code: $`
        <svg>
          <text>
            <tspan />
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
              "ruleId": "no-empty-text",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'text-comment-only.svg',
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
              "ruleId": "no-empty-text",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
