import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-empty-groups'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-empty-groups'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'namespaces.svg',
      code: '<svg><g xmlns="urn:metadata"/></svg>',
    },
    {
      name: 'group-with-child',
      description: `allows g element containing child elements`,
      filename: 'group-with-child.svg',
      code: $`
        <svg>
          <g>
            <circle r="10" />
          </g>
        </svg>
      `,
    },
    {
      name: 'group-with-text',
      description: `allows g element containing text content`,
      filename: 'group-with-text.svg',
      code: $`
        <svg>
          <g>foo</g>
        </svg>
      `,
    },
    {
      name: 'nested-group-non-empty',
      description: `allows nested g element when it contains child element`,
      filename: 'nested-group.svg',
      code: $`
        <svg>
          <g>
            <g>
              <rect width="10" height="10" />
            </g>
          </g>
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
      name: 'empty-group',
      description: `reports empty g element with no children`,
      filename: 'empty-group.svg',
      code: $`
        <svg>
          <g></g>
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
              "message": "Group element 'g' must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-groups",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      name: 'group-only-whitespace',
      description: `reports g element containing only whitespace text`,
      filename: 'whitespace-group.svg',
      code: $`
        <svg>
          <g>
        
          </g>
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
              "message": "Group element 'g' must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-groups",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      name: 'group-only-comment',
      description: `reports g element containing only comment node`,
      filename: 'comment-group.svg',
      code: $`
        <svg>
          <g>
            <!-- noop -->
          </g>
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
              "message": "Group element 'g' must not be empty",
              "messageId": "invalid",
              "ruleId": "no-empty-groups",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
