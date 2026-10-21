import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-empty-title'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-empty-title'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'cdata-title.svg',
      code: '<svg><title><![CDATA[Logo]]></title></svg>',
    },
    {
      filename: 'literal-cdata.svg',
      code: '<svg><title><![CDATA[&#32;]]></title></svg>',
    },
    {
      filename: 'decode-once.svg',
      code: '<svg><title>&amp;#32;</title></svg>',
    },
    {
      filename: 'namespaces.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:title>Logo</s:title></s:svg>',
    },
    {
      filename: 'valid.svg',
      code: $`
        <svg>
          <title>foo</title>
        </svg>
      `,
    },
    {
      filename: 'title-with-tspan-text.svg',
      code: $`
        <svg>
          <title>
            <tspan>foo</tspan>
          </title>
        </svg>
      `,
    },
  ],
  invalid: [
    ...[
      '<svg><title>&#32;&#9;</title></svg>',
      '<svg><title><tspan>&#x20;&#10;</tspan></title></svg>',
      '<svg><title><![CDATA[   ]]></title></svg>',
    ].map(code => ({
      filename: 'empty-content.svg',
      code,
      errors: ['invalid'],
    })),
    {
      filename: 'namespaces.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:title/></s:svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
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
              "ruleId": "no-empty-title",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'title-no-readable-text.svg',
      code: $`
        <svg>
          <title>
            <tspan />
          </title>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 11,
              "endLine": 4,
              "line": 2,
              "message": "Element title must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-title",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'title-comment-only.svg',
      code: $`
        <svg>
          <title>
            <!-- foobar -->
          </title>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 11,
              "endLine": 4,
              "line": 2,
              "message": "Element title must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-title",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
