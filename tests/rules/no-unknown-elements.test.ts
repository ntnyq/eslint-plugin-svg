import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-unknown-elements'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'regression.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:linearGradient/></s:svg>',
    },
    { filename: 'regression.svg', code: '<svg><font/></svg>' },
    {
      filename: 'regression.svg',
      code: '<svg><foreignObject><div xmlns="http://www.w3.org/1999/xhtml"><p>Hello</p></div></foreignObject></svg>',
    },
    {
      filename: 'regression.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:anything xmlns:s="urn:metadata"/></s:svg>',
    },
    {
      filename: 'known-elements.svg',
      code: $`
        <svg>
          <defs>
            <linearGradient id="g">
              <stop offset="0%" />
            </linearGradient>
          </defs>
          <rect fill="url(#g)" />
        </svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'regression.svg',
      code: '<svg><lineargradient/></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg><clippath/></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:lineargradient/></s:svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'unknown-elements.svg',
      code: $`
        <svg>
          <custom-node />
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
