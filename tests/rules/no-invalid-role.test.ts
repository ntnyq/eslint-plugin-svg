import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-invalid-role'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-invalid-role'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    { filename: 'regression.svg', code: '<svg role="generic"/>' },
    { filename: 'regression.svg', code: '<svg role="grid"/>' },
    { filename: 'regression.svg', code: '<svg role="listbox"/>' },
    { filename: 'regression.svg', code: '<svg role="radiogroup"/>' },
    { filename: 'regression.svg', code: '<svg role="switch checkbox"/>' },
    { filename: 'regression.svg', code: '<svg role="unknown img"/>' },
    { filename: 'regression.svg', code: '<svg role="widget img"/>' },
    { filename: 'regression.svg', code: '<svg role=" graphics-document "/>' },
    { filename: 'regression.svg', code: '<svg role="graphics-symbol"/>' },
    { filename: 'regression.svg', code: '<svg role="graphics-object"/>' },
    { filename: 'regression.svg', code: '<svg role="i&#109;g"/>' },
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
    {
      description: 'allow-abstract-roles',
      options: [
        {
          allowAbstractRoles: true,
        },
      ],
      code: $`
        <svg role="widget"></svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'regression.svg',
      code: '<svg role="unknown widget"/>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg role=""/>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
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
      description: 'abstract-role.svg',
      code: $`
        <svg role="widget"></svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 18,
              "endLine": 1,
              "line": 1,
              "message": "Attribute role value 'widget' is invalid",
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
