import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-base64-data-url'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-base64-data-url'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      name: 'external-href',
      filename: 'external-href.svg',
      code: $`
        <svg>
          <image href="https://example.com/logo.png" />
        </svg>
      `,
    },
    {
      name: 'non-base64-data-url-default-mode',
      filename: 'non-base64-data-url-default-mode.svg',
      code: $`
        <svg>
          <image href="data:image/svg+xml,%3Csvg%20/%3E" />
        </svg>
      `,
    },
    {
      name: 'attributes-scope',
      filename: 'attributes-scope.svg',
      options: [
        {
          attributes: ['href'],
        },
      ],
      code: $`
        <svg>
          <rect fill="url(data:image/png;base64,AAA=)" />
        </svg>
      `,
    },
    {
      name: 'ignore-attribute',
      filename: 'ignore-attribute.svg',
      options: [
        {
          ignoreAttributes: ['xlink:href'],
        },
      ],
      code: $`
        <svg xmlns:xlink="http://www.w3.org/1999/xlink">
          <image xlink:href="data:image/png;base64,AAA=" />
        </svg>
      `,
    },
    {
      name: 'skip-url-function-check',
      filename: 'skip-url-function-check.svg',
      options: [
        {
          checkUrlFunction: false,
        },
      ],
      code: $`
        <svg>
          <rect style="fill: url(data:image/png;base64,AAA=);" />
        </svg>
      `,
    },
    {
      name: 'allow-mime-type',
      filename: 'allow-mime-type.svg',
      options: [
        {
          allowMimeTypes: ['image/svg+xml'],
        },
      ],
      code: $`
        <svg>
          <image href="data:image/svg+xml;base64,PHN2ZyAvPg==" />
        </svg>
      `,
    },
  ],
  invalid: [
    {
      name: 'base64-in-href',
      filename: 'base64-in-href.svg',
      code: $`
        <svg>
          <image href="data:image/png;base64,AAA=" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 16,
              "endColumn": 42,
              "endLine": 2,
              "line": 2,
              "message": "Data URL usage is not allowed in attribute 'href'",
              "messageId": "invalid",
              "ruleId": "no-base64-data-url",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      name: 'base64-in-xlink-href',
      filename: 'base64-in-xlink-href.svg',
      code: $`
        <svg xmlns:xlink="http://www.w3.org/1999/xlink">
          <use xlink:href="data:image/png;base64,AAA=" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 20,
              "endColumn": 46,
              "endLine": 2,
              "line": 2,
              "message": "Data URL usage is not allowed in attribute 'xlink:href'",
              "messageId": "invalid",
              "ruleId": "no-base64-data-url",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      name: 'base64-in-url-function',
      filename: 'base64-in-url-function.svg',
      code: $`
        <svg>
          <rect fill="url(data:image/png;base64,AAA=)" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 46,
              "endLine": 2,
              "line": 2,
              "message": "Data URL usage is not allowed in attribute 'fill'",
              "messageId": "invalid",
              "ruleId": "no-base64-data-url",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      name: 'any-data-url-mode',
      filename: 'any-data-url-mode.svg',
      options: [
        {
          mode: 'any-data-url',
        },
      ],
      code: $`
        <svg>
          <image href="data:image/svg+xml,%3Csvg%20/%3E" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 16,
              "endColumn": 48,
              "endLine": 2,
              "line": 2,
              "message": "Data URL usage is not allowed in attribute 'href'",
              "messageId": "invalid",
              "ruleId": "no-base64-data-url",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      name: 'attributes-selective-check',
      filename: 'attributes-selective-check.svg',
      options: [
        {
          attributes: ['fill', 'stroke'],
        },
      ],
      code: $`
        <svg>
          <rect fill="url(data:image/png;base64,AAA=)" href="https://example.com/logo.png" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 46,
              "endLine": 2,
              "line": 2,
              "message": "Data URL usage is not allowed in attribute 'fill'",
              "messageId": "invalid",
              "ruleId": "no-base64-data-url",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
