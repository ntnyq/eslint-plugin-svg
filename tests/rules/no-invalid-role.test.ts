import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-invalid-role'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-invalid-role'

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
      description: 'valid-role',
      code: $`
        <svg role="img"></svg>
      `,
    },
    {
      description: 'nested-role',
      code: $`
        <svg>
          <circle role="img" r="10" />
        </svg>
      `,
    },
    {
      description: 'options-roles',
      options: [
        {
          roles: ['img'],
        },
      ],
      code: $`
        <svg>
          <circle role="img" r="10" />
        </svg>
      `,
    },
  ],
  invalid: [
    {
      description: 'invalid-role.svg',
      code: $`
        <svg role="foobar"></svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 18,
              "endLine": 1,
              "line": 1,
              "message": "Attribute role value 'foobar' is invalid",
              "messageId": "invalid",
              "ruleId": "no-invalid-role",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      description: 'nested-role.svg',
      code: $`
        <svg>
          <title role="foobar">foobar</title>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 16,
              "endColumn": 22,
              "endLine": 2,
              "line": 2,
              "message": "Attribute role value 'foobar' is invalid",
              "messageId": "invalid",
              "ruleId": "no-invalid-role",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      description: 'options-roles.svg',
      options: [
        {
          roles: ['list'],
        },
      ],
      code: $`
        <svg>
          <circle role="img" r="10" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 17,
              "endColumn": 20,
              "endLine": 2,
              "line": 2,
              "message": "Attribute role value 'img' is invalid",
              "messageId": "invalid",
              "ruleId": "no-invalid-role",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
