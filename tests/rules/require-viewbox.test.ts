import rule, { RULE_NAME } from '../../src/rules/require-viewbox'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      name: 'svg-with-viewbox',
      description: `allows svg element with viewBox attribute`,
      filename: 'with-viewbox.svg',
      code: $`
        <svg viewBox="0 0 100 100">
          <rect width="10" height="10" />
        </svg>
      `,
    },
    {
      name: 'viewbox-with-whitespace',
      description: `allows viewBox attribute with whitespace-surrounded value`,
      filename: 'viewbox-whitespace.svg',
      code: $`
        <svg viewBox=" 0 0 50 50 ">
          <circle r="10" />
        </svg>
      `,
    },
    {
      name: 'nested-svg-all-have-viewbox',
      description: `allows nested svg elements when each provides viewBox`,
      filename: 'nested-viewbox.svg',
      code: $`
        <svg viewBox="0 0 10 10">
          <svg viewBox="0 0 5 5">
            <rect width="1" height="1" />
          </svg>
        </svg>
      `,
    },
  ],
  invalid: [
    {
      name: 'missing-viewbox',
      description: `reports svg element missing viewBox attribute`,
      filename: 'missing-viewbox.svg',
      code: $`
        <svg>
          <rect width="10" height="10" />
        </svg>
      `,
      errors: [
        {
          messageId: 'missing',
        },
      ],
    },
    {
      name: 'empty-viewbox-value',
      description: `reports svg element with empty viewBox attribute value`,
      filename: 'empty-viewbox.svg',
      code: $`
        <svg viewBox="">
          <circle r="10" />
        </svg>
      `,
      errors: [
        {
          messageId: 'missing',
        },
      ],
    },
    {
      name: 'whitespace-viewbox',
      description: `reports svg element with whitespace-only viewBox value`,
      filename: 'whitespace-viewbox.svg',
      code: $`
        <svg viewBox="   ">
          <text>foo</text>
        </svg>
      `,
      errors: [
        {
          messageId: 'missing',
        },
      ],
    },
    {
      name: 'nested-missing-viewbox',
      description: `reports nested svg element missing viewBox even if parent has one`,
      filename: 'nested-missing-viewbox.svg',
      code: $`
        <svg viewBox="0 0 20 20">
          <svg>
            <rect width="5" height="5" />
          </svg>
        </svg>
      `,
      errors: [
        {
          messageId: 'missing',
        },
      ],
    },
  ],
})
