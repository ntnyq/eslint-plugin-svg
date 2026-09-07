import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-unsafe-href'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'rebound-xlink.svg',
      code: '<svg xmlns:xlink="urn:metadata"><g xlink:href="javascript:alert(1)"/></svg>',
    },
    {
      filename: 'regression.svg',
      code: '<svg><a href="java&amp;#x73;cript:alert(1)"/></svg>',
    },
    {
      filename: 'regression.svg',
      code: '<svg><a href="./https:icon.svg"/></svg>',
    },
    {
      filename: 'safe-fragment-reference.svg',
      code: $`
        <svg>
          <use href="#icon" />
        </svg>
      `,
    },
    {
      filename: 'safe-local-path.svg',
      code: $`
        <svg xmlns:xlink="http://www.w3.org/1999/xlink">
          <image xlink:href="./icons.svg#logo" />
        </svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'regression.svg',
      code: '<svg><a href="javascript&#58;alert(1)"/></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg><a href="java&#x73;cript:alert(1)"/></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg><a href="java&#x0A;script:alert(1)"/></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg><a href="java&#9;script:alert(1)"/></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg xmlns:l="http://www.w3.org/1999/xlink"><a l:href="javascript:alert(1)"/></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg><image href="https:example.com/icon.svg"/></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg><image href="data&#58;image/svg+xml,&lt;svg/>"/></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'javascript-href.svg',
      code: $`
        <svg>
          <a href="javascript:alert(1)" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
        expect(errors[0]?.messageId).toBe('invalid')
      },
    },
    {
      filename: 'remote-href.svg',
      code: $`
        <svg>
          <use href="http://example.com/icons.svg#id" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
        expect(errors[0]?.messageId).toBe('invalid')
      },
    },
    {
      filename: 'data-xlink-href.svg',
      code: $`
        <svg xmlns:xlink="http://www.w3.org/1999/xlink">
          <image xlink:href="data:image/png;base64,AAA=" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
        expect(errors[0]?.messageId).toBe('invalid')
      },
    },
  ],
})
