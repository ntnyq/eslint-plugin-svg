import rule, { RULE_NAME } from '../../src/rules/no-empty-groups'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
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
      name: 'empty-group',
      description: `reports empty g element with no children`,
      filename: 'empty-group.svg',
      code: $`
        <svg>
          <g></g>
        </svg>
      `,
      errors: [
        {
          messageId: 'invalid',
        },
      ],
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
      errors: [
        {
          messageId: 'invalid',
        },
      ],
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
      errors: [
        {
          messageId: 'invalid',
        },
      ],
    },
  ],
})
