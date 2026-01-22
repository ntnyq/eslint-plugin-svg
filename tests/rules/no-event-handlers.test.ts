import rule, { RULE_NAME } from '../../src/rules/no-event-handlers'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      description: `allows event handler names matching provided pattern to be ignored`,
      filename: 'no-event-handlers.svg',
      code: $`
          ignores: ['^on'],
          <rect width="10" height="10" />
        </svg>
      `,
    },
    {
      name: 'ignore-by-string',
      description: `allows configured event handler attribute name to be ignored`,
      filename: 'ignore-string.svg',
      options: [
        {
          ignores: ['onclick'],
        },
      ],
      code: $`
        <svg>
          <rect onclick="alert('x')" width="10" height="10" />
        </svg>
      `,
    },
    {
      name: 'ignore-by-regex',
      description: `allows event handler names matching provided regex to be ignored`,
      filename: 'ignore-regex.svg',
      options: [
        {
          ignores: ['^onmousemove$'],
        },
      ],
      code: $`
        <svg>
          <circle onmousemove="foo()" r="10" />
        </svg>
      `,
    },
  ],
  invalid: [
    {
      name: 'onclick-root',
      description: `reports inline onclick handler on element`,
      filename: 'onclick.svg',
      code: $`
        <svg>
          <rect onclick="alert('x')" width="10" height="10" />
        </svg>
      `,
      errors: [
        {
          messageId: 'invalid',
        },
      ],
    },
    {
      name: 'nested-onload',
      description: `reports inline onload handler on nested element`,
      filename: 'onload.svg',
      code: $`
        <svg>
          <g>
            <image onload="foo()" href="foo.png" />
          </g>
        </svg>
      `,
      errors: [
        {
          messageId: 'invalid',
        },
      ],
    },
    {
      name: 'ignore-not-matching',
      description: `still reports event handler when ignores do not match attribute name`,
      filename: 'ignore-miss.svg',
      options: [
        {
          ignores: ['onHover'],
        },
      ],
      code: $`
        <svg>
          <text onclick="bar()">foo</text>
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
