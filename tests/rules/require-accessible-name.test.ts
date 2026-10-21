import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/require-accessible-name'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'cdata-title.svg',
      code: '<svg><title><![CDATA[Logo]]></title></svg>',
    },
    {
      filename: 'literal-cdata.svg',
      code: '<svg><title><![CDATA[&#32;]]></title></svg>',
    },
    {
      filename: 'cdata-reference.svg',
      code: '<svg aria-labelledby="label"><text id="label"><![CDATA[Logo]]></text></svg>',
    },
    { filename: 'regression.svg', code: '<svg aria-hidden="true"/>' },
    { filename: 'regression.svg', code: '<svg role="presentation"/>' },
    { filename: 'regression.svg', code: '<svg role="none"/>' },
    {
      filename: 'regression.svg',
      code: '<svg aria-hidden="true"><svg role="img"/></svg>',
    },
    {
      filename: 'regression.svg',
      code: '<svg aria-labelledby="later"><text id="later">Name</text></svg>',
    },
    {
      filename: 'regression.svg',
      code: '<svg aria-labelledby="missing actual"><text id="actual">Name</text></svg>',
    },
    {
      filename: 'regression.svg',
      code: '<svg aria-labelledby="label"><g id="label" aria-label="Name"/></svg>',
    },
    {
      filename: 'regression.svg',
      code: '<svg aria-labelledby="label"><text id="label" aria-hidden="true">Name</text></svg>',
    },
    {
      filename: 'regression.svg',
      code: '<svg id="self" aria-label="Name" aria-labelledby="self"/>',
    },
    {
      filename: 'regression.svg',
      code: '<svg aria-label="Fallback" aria-labelledby="missing"/>',
    },
    {
      filename: 'regression.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:title>Name</s:title></s:svg>',
    },
    {
      filename: 'root-svg-with-title.svg',
      code: $`
        <svg>
          <title>Logo</title>
          <path d="M0 0h10v10z" />
        </svg>
      `,
    },
    {
      filename: 'root-svg-with-aria-label.svg',
      code: $`
        <svg aria-label="Search icon">
          <path d="M0 0h10v10z" />
        </svg>
      `,
    },
    {
      filename: 'nested-svg-without-role-img.svg',
      code: $`
        <svg aria-label="Outer icon set">
          <svg>
            <path d="M0 0h10v10z" />
          </svg>
        </svg>
      `,
    },
    {
      filename: 'role-img-svg-with-aria-labelledby.svg',
      code: $`
        <svg aria-label="Outer icon set">
          <g id="name">Icon Name</g>
          <svg role="img" aria-labelledby="name">
            <path d="M0 0h10v10z" />
          </svg>
        </svg>
      `,
    },
  ],
  invalid: [
    {
      filename: 'empty-cdata.svg',
      code: '<svg><title><![CDATA[   ]]></title></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('missing')
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg aria-labelledby="missing"/>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg aria-labelledby="empty"><g id="empty"/></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg aria-labelledby="blank"><text id="blank">&#32;&#9;</text></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg aria-labelledby="a"><g id="a" aria-labelledby="b"/><text id="b">Name</text></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg id="a" aria-labelledby="a"/>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg aria-labelledby="a"><g id="a" aria-labelledby="b"/><g id="b" aria-labelledby="a"/></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg aria-labelledby="empty" aria-label="Ignored"><g id="empty"/></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg aria-label="Outer"><svg role="unknown img"/></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg aria-label="&#32;"/>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg><title>&#32;</title></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg role="presentation" tabindex="0"/>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'regression.svg',
      code: '<svg aria-labelledby="label"><g id="label"><text aria-hidden="true">Hidden</text></g></svg>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
      },
    },
    {
      filename: 'root-svg-missing-name.svg',
      code: $`
        <svg>
          <path d="M0 0h10v10z" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
        expect(errors[0]?.messageId).toBe('missing')
      },
    },
    {
      filename: 'root-svg-empty-title.svg',
      code: $`
        <svg>
          <title>  </title>
          <path d="M0 0h10v10z" />
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
        expect(errors[0]?.messageId).toBe('missing')
      },
    },
    {
      filename: 'role-img-svg-missing-name.svg',
      code: $`
        <svg aria-label="Outer icon set">
          <svg role="img">
            <path d="M0 0h10v10z" />
          </svg>
        </svg>
      `,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.ruleId).toBe(RULE_NAME)
        expect(errors[0]?.messageId).toBe('missing')
      },
    },
  ],
})
