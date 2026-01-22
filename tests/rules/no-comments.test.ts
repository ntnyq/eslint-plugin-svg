import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-comments'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      name: 'no-comments',
      description: 'allows SVG without any comments',
      filename: 'no-comments.svg',
      code: $`
        <svg>
          <circle r="10" />
          <rect width="20" height="20" />
        </svg>
      `,
    },
    {
      name: 'nested-elements',
      description: 'allows SVG with nested elements but no comments',
      filename: 'nested.svg',
      code: $`
        <svg>
          <g>
            <text>Hello</text>
          </g>
        </svg>
      `,
    },
  ],
  invalid: [
    {
      name: 'single-comment',
      description: 'reports when SVG contains a comment',
      filename: 'with-comment.svg',
      code: $`
        <svg>
          <!-- This is a comment -->
          <circle r="10" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 29,
              "endLine": 2,
              "line": 2,
              "message": "Comments are not allowed in SVG files",
              "messageId": "invalid",
              "nodeType": "Comment",
              "ruleId": "no-comments",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      name: 'multiple-comments',
      description: 'reports all comments in SVG file',
      filename: 'multiple-comments.svg',
      code: $`
        <svg>
          <!-- First comment -->
          <circle r="10" />
          <!-- Second comment -->
          <rect width="20" height="20" />
          <!-- Third comment -->
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 25,
              "endLine": 2,
              "line": 2,
              "message": "Comments are not allowed in SVG files",
              "messageId": "invalid",
              "nodeType": "Comment",
              "ruleId": "no-comments",
              "severity": 2,
            },
            {
              "column": 3,
              "endColumn": 26,
              "endLine": 4,
              "line": 4,
              "message": "Comments are not allowed in SVG files",
              "messageId": "invalid",
              "nodeType": "Comment",
              "ruleId": "no-comments",
              "severity": 2,
            },
            {
              "column": 3,
              "endColumn": 25,
              "endLine": 6,
              "line": 6,
              "message": "Comments are not allowed in SVG files",
              "messageId": "invalid",
              "nodeType": "Comment",
              "ruleId": "no-comments",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      name: 'nested-comment',
      description: 'reports comments inside nested elements',
      filename: 'nested-comment.svg',
      code: $`
        <svg>
          <g>
            <!-- Nested comment -->
            <circle r="10" />
          </g>
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 28,
              "endLine": 3,
              "line": 3,
              "message": "Comments are not allowed in SVG files",
              "messageId": "invalid",
              "nodeType": "Comment",
              "ruleId": "no-comments",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
