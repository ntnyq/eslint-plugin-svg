import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-empty-container'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-empty-container'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'namespaces.svg',
      code: '<svg><g xmlns="urn:metadata"/></svg>',
    },
    {
      filename: 'empty-root-svg.svg',
      code: $`
        <svg></svg>
      `,
    },
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
      options: [
        {
          ignores: ['a'],
        },
      ],
      code: $`
        <svg>
          <a></a>
        </svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'namespaces.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:g/></s:svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
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
              "endColumn": 10,
              "endLine": 2,
              "line": 2,
              "message": "Container element 'a' must not be empty",
              "messageId": "invalid",
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
              "endColumn": 7,
              "endLine": 4,
              "line": 2,
              "message": "Container element 'a' must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-container",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'user-defined.svg',
      options: [
        {
          elements: ['metadata'],
        },
      ],
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
              "endColumn": 24,
              "endLine": 2,
              "line": 2,
              "message": "Container element 'metadata' must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-container",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'empty-root-svg.svg',
      options: [
        {
          checkRootSvg: true,
        },
      ],
      code: $`
        <svg></svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 12,
              "endLine": 1,
              "line": 1,
              "message": "Container element 'svg' must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-container",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
