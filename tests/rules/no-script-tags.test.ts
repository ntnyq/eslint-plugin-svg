import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-script-tags'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-script-tags'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      name: 'no-script-present',
      description: `allows svg without script elements`,
      filename: 'no-script.svg',
      code: $`
        <svg>
          <rect width="10" height="10" />
        </svg>
      `,
    },
    {
      name: 'style-and-title-allowed',
      description: `allows style element and other non-script content`,
      filename: 'style-allowed.svg',
      code: $`
        <svg>
          <style>.box { fill: red; }</style>
          <title>ok</title>
          <rect class="box" width="10" height="10" />
        </svg>
      `,
    },
  ],
  invalid: [
    {
      name: 'root-script',
      description: `reports script element at root level`,
      filename: 'root-script.svg',
      code: $`
        <svg>
          <script>alert('xss')</script>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 32,
              "endLine": 2,
              "line": 2,
              "message": "Script elements are not allowed in SVG",
              "messageId": "invalid",
              "ruleId": "no-script-tags",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      name: 'nested-script',
      description: `reports nested script element inside group`,
      filename: 'nested-script.svg',
      code: $`
        <svg>
          <g>
            <script type="application/ecmascript">console.log('hi')</script>
          </g>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 69,
              "endLine": 3,
              "line": 3,
              "message": "Script elements are not allowed in SVG",
              "messageId": "invalid",
              "ruleId": "no-script-tags",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
