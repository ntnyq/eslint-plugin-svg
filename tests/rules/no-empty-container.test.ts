import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-empty-container'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'valid.svg',
      code: $`
        <svg>
          <a>
            <text>foo</text>
          </a>
        </svg>
      `,
    },
    {
      filename: 'ignore-a.svg',
      options: {
        ignores: ['a'],
      },
      code: $`
        <svg>
          <a></a>
        </svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'empty-container.svg',
      code: $`
        <svg>
          <a></a>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 8,
              "endLine": 2,
              "line": 2,
              "message": "Container element 'a' must not be empty",
              "messageId": "invalid",
              "nodeType": "Tag",
              "ruleId": "no-empty-container",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'container-comment.svg',
      code: $`
        <svg>
          <a>
            <!-- foobar -->
          </a>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 5,
              "endLine": 4,
              "line": 2,
              "message": "Container element 'a' must not be empty",
              "messageId": "invalid",
              "nodeType": "Tag",
              "ruleId": "no-empty-container",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'user-defined.svg',
      options: {
        elements: ['metadata'],
      },
      code: $`
        <svg>
          <metadata></metadata>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 22,
              "endLine": 2,
              "line": 2,
              "message": "Container element 'metadata' must not be empty",
              "messageId": "invalid",
              "nodeType": "Tag",
              "ruleId": "no-empty-container",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
