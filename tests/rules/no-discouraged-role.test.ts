import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-discouraged-role'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-discouraged-role'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'embedded-xhtml.svg',
      code: '<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><div xmlns="http://www.w3.org/1999/xhtml" role="heading" aria-level="2">Heading</div></foreignObject></svg>',
    },
    {
      filename: 'foreign-prefix.svg',
      code: '<svg xmlns:h="http://www.w3.org/1999/xhtml"><foreignObject><h:div role="heading" aria-level="2">Heading</h:div></foreignObject></svg>',
    },
    {
      filename: 'rebound-prefix.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:g xmlns:s="urn:metadata" role="table"/></s:svg>',
    },
    { filename: 'regression.svg', code: '<svg role="img"/>' },
    { filename: 'regression.svg', code: '<svg role="unknown img table"/>' },
    { filename: 'regression.svg', code: '<svg role="note table"/>' },
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
      filename: 'svg-prefix.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg" role="table"/>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('discouraged')
      },
    },
    {
      filename: 'nested-svg-namespace.svg',
      code: '<svg><foreignObject><div xmlns="http://www.w3.org/1999/xhtml"><svg xmlns="http://www.w3.org/2000/svg" role="table"/></div></foreignObject></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('discouraged')
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg role="unknown table img"/>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg role="t&#97;ble note"/>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
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
