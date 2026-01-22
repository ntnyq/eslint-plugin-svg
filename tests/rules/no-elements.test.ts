import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-elements'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-elements'

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
      filename: 'empty-text.svg',
      options: [
        {
          elements: ['script', 'style'],
        },
      ],
      code: $`
        <svg>
          <text>foo</text>
          <style></style>
          <script></script>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 18,
              "endLine": 3,
              "line": 3,
              "message": "Element 'style' is not allowed",
              "messageId": "invalid",
              "nodeType": "Tag",
              "ruleId": "no-elements",
              "severity": 2,
            },
            {
              "column": 3,
              "endColumn": 20,
              "endLine": 4,
              "line": 4,
              "message": "Element 'script' is not allowed",
              "messageId": "invalid",
              "nodeType": "Tag",
              "ruleId": "no-elements",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
