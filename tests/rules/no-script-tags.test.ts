import rule, { RULE_NAME } from '../../src/rules/no-script-tags'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      name: 'no-script-present',
      description: `allows svg without script elements`,
      filename: 'no-script.svg',
      code: $`
        <svg>
          <rect width="10" height="10" />
        </svg>
      `,
    },
    {
      name: 'style-and-title-allowed',
      description: `allows style element and other non-script content`,
      filename: 'style-allowed.svg',
      code: $`
        <svg>
          <style>.box { fill: red; }</style>
          <title>ok</title>
          <rect class="box" width="10" height="10" />
        </svg>
      `,
    },
  ],
  invalid: [
    {
      name: 'root-script',
      description: `reports script element at root level`,
      filename: 'root-script.svg',
      code: $`
        <svg>
          <script>alert('xss')</script>
        </svg>
      `,
      errors: [
        {
          messageId: 'invalid',
        },
      ],
    },
    {
      name: 'nested-script',
      description: `reports nested script element inside group`,
      filename: 'nested-script.svg',
      code: $`
        <svg>
          <g>
            <script type="application/ecmascript">console.log('hi')</script>
          </g>
        </svg>
      `,
      errors: [
        {
          messageId: 'invalid',
        },
      ],
    },
  ],
})
