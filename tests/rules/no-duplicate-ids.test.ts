import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-duplicate-ids'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-duplicate-ids'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      name: 'unique-ids',
      description: 'allows SVG elements with unique id attributes',
      filename: 'unique-ids.svg',
      code: $`
        <svg>
          <circle id="circle1" />
          <rect id="rect1" />
          <path id="path1" />
        </svg>
      `,
    },
    {
      name: 'no-ids',
      description: 'allows SVG elements without any id attributes',
      filename: 'no-ids.svg',
      code: $`
        <svg>
          <circle />
          <rect />
          <path />
        </svg>
      `,
    },
    {
      name: 'single-id',
      description: 'allows SVG with only one element having an id attribute',
      filename: 'single-id.svg',
      code: $`
        <svg id="root">
          <circle />
        </svg>
      `,
    },
  ],
  invalid: [
    {
      name: 'duplicate-ids',
      description: 'reports when two elements have the same id attribute',
      filename: 'duplicate-ids.svg',
      code: $`
        <svg>
          <circle id="shape" />
          <rect id="shape" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 19,
              "endLine": 3,
              "line": 3,
              "message": "Duplicate id 'shape' found",
              "messageId": "duplicate",
              "ruleId": "no-duplicate-ids",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      name: 'multiple-duplicates',
      description:
        'reports when multiple pairs of elements have duplicate id attributes',
      filename: 'multiple-duplicates.svg',
      code: $`
        <svg>
          <circle id="foo" />
          <rect id="bar" />
          <path id="foo" />
          <ellipse id="bar" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 17,
              "endLine": 4,
              "line": 4,
              "message": "Duplicate id 'foo' found",
              "messageId": "duplicate",
              "ruleId": "no-duplicate-ids",
              "severity": 2,
            },
            {
              "column": 12,
              "endColumn": 20,
              "endLine": 5,
              "line": 5,
              "message": "Duplicate id 'bar' found",
              "messageId": "duplicate",
              "ruleId": "no-duplicate-ids",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      name: 'nested-duplicate',
      description:
        'reports when nested element has the same id as parent element',
      filename: 'nested-duplicate.svg',
      code: $`
        <svg id="root">
          <g id="group">
            <circle id="root" />
          </g>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 13,
              "endColumn": 22,
              "endLine": 3,
              "line": 3,
              "message": "Duplicate id 'root' found",
              "messageId": "duplicate",
              "ruleId": "no-duplicate-ids",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
