import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-discouraged-role'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-discouraged-role'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      description: 'no-role',
      code: $`
        <svg></svg>
      `,
    },
    {
      description: 'non-discouraged-role',
      code: $`
        <svg role="note"></svg>
      `,
    },
    {
      description: 'custom-discouraged-list-does-not-include-img',
      options: [
        {
          roles: ['table'],
        },
      ],
      code: $`
        <svg role="img"></svg>
      `,
    },
  ],
  invalid: [
    {
      description: 'discouraged-role-default-list',
      code: $`
        <svg role="table"></svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 17,
              "endLine": 1,
              "line": 1,
              "message": "Attribute role value 'table' is discouraged for SVG and should be avoided",
              "messageId": "discouraged",
              "ruleId": "no-discouraged-role",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      description: 'discouraged-role-custom-list',
      options: [
        {
          roles: ['article'],
        },
      ],
      code: $`
        <svg role="article"></svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 19,
              "endLine": 1,
              "line": 1,
              "message": "Attribute role value 'article' is discouraged for SVG and should be avoided",
              "messageId": "discouraged",
              "ruleId": "no-discouraged-role",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
