import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-empty-desc'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-empty-desc'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'namespaces.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:desc>Logo</s:desc></s:svg>',
    },
    {
      filename: 'valid.svg',
      code: $`
        <svg>
          <desc>foo</desc>
        </svg>
      `,
    },
    {
      filename: 'desc-with-tspan-text.svg',
      code: $`
        <svg>
          <desc>
            <tspan>foo</tspan>
          </desc>
        </svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'namespaces.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:desc/></s:svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
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
              "column": 3,
              "endColumn": 16,
              "endLine": 2,
              "line": 2,
              "message": "Element desc must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-desc",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'empty-desc.svg',
      code: $`
        <svg>
          <desc>
          </desc>
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
              "message": "Element desc must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-desc",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'desc-no-readable-text.svg',
      code: $`
        <svg>
          <desc>
            <tspan />
          </desc>
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
              "message": "Element desc must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-desc",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'desc-comment-only.svg',
      code: $`
        <svg>
          <desc>
            <!-- foobar -->
          </desc>
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
              "message": "Element desc must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-desc",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
