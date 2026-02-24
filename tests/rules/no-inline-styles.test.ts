import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-inline-styles'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-inline-styles'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      name: 'no-style-attribute',
      description: `allows svg elements without inline style attributes`,
      filename: 'no-style.svg',
      code: $`
        <svg>
          <rect width="10" height="10" />
        </svg>
      `,
    },
    {
      name: 'class-instead-of-style',
      description: `allows styling through class attribute instead of inline style`,
      filename: 'class-style.svg',
      code: $`
        <svg>
          <rect class="box" width="10" height="10" />
        </svg>
      `,
    },
    {
      name: 'style-element-allowed',
      description: `allows usage of style element since rule targets inline attributes`,
      filename: 'style-element.svg',
      code: $`
        <svg>
          <style>
            .box { fill: red; }
          </style>
          <rect class="box" width="10" height="10" />
        </svg>
      `,
    },
  ],
  invalid: [
    {
      name: 'inline-style-on-rect',
      description: `reports inline style attribute on element`,
      filename: 'inline-style-rect.svg',
      code: $`
        <svg>
          <rect width="10" height="10" style="fill: red;" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 39,
              "endColumn": 49,
              "endLine": 2,
              "line": 2,
              "message": "Inline style attributes are not allowed",
              "messageId": "invalid",
              "ruleId": "no-inline-styles",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      name: 'inline-style-empty',
      description: `reports empty inline style attribute on element`,
      filename: 'inline-style-empty.svg',
      code: $`
        <svg>
          <circle style="" r="10" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 18,
              "endColumn": 18,
              "endLine": 2,
              "line": 2,
              "message": "Inline style attributes are not allowed",
              "messageId": "invalid",
              "ruleId": "no-inline-styles",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      name: 'inline-style-nested',
      description: `reports inline style attribute on nested element`,
      filename: 'inline-style-nested.svg',
      code: $`
        <svg>
          <g>
            <text style="font-size: 12px;">foo</text>
          </g>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 18,
              "endColumn": 34,
              "endLine": 3,
              "line": 3,
              "message": "Inline style attributes are not allowed",
              "messageId": "invalid",
              "ruleId": "no-inline-styles",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
