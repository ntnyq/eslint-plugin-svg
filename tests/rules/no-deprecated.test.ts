import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-deprecated'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-deprecated'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'namespaces.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:path/></s:svg>',
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
      filename: 'allow-font.svg',
      options: [
        {
          allowElements: ['font'],
        },
      ],
      code: $`
        <svg>
          <font></font>
        </svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'namespaces.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:font/></s:svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'empty-container.svg',
      code: $`
        <svg>
          <font></font>
          <font-face></font-face>
          <font-face-format></font-face-format>
          <font-face-name></font-face-name>
          <glyph></glyph>
          <cursor></cursor>
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
              "message": "Element 'font' is deprecated",
              "messageId": "deprecatedElement",
              "ruleId": "no-deprecated",
              "severity": 2,
            },
            {
              "column": 3,
              "endColumn": 26,
              "endLine": 3,
              "line": 3,
              "message": "Element 'font-face' is deprecated",
              "messageId": "deprecatedElement",
              "ruleId": "no-deprecated",
              "severity": 2,
            },
            {
              "column": 3,
              "endColumn": 40,
              "endLine": 4,
              "line": 4,
              "message": "Element 'font-face-format' is deprecated",
              "messageId": "deprecatedElement",
              "ruleId": "no-deprecated",
              "severity": 2,
            },
            {
              "column": 3,
              "endColumn": 36,
              "endLine": 5,
              "line": 5,
              "message": "Element 'font-face-name' is deprecated",
              "messageId": "deprecatedElement",
              "ruleId": "no-deprecated",
              "severity": 2,
            },
            {
              "column": 3,
              "endColumn": 18,
              "endLine": 6,
              "line": 6,
              "message": "Element 'glyph' is deprecated",
              "messageId": "deprecatedElement",
              "ruleId": "no-deprecated",
              "severity": 2,
            },
            {
              "column": 3,
              "endColumn": 20,
              "endLine": 7,
              "line": 7,
              "message": "Element 'cursor' is deprecated",
              "messageId": "deprecatedElement",
              "ruleId": "no-deprecated",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
