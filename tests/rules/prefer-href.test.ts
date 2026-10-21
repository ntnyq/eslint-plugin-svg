import rule, { RULE_NAME } from '../../src/rules/prefer-href'
import { run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    '<svg><text><tref xlink:href="#label"/></text></svg>',
    '<svg><altGlyph xlink:href="#glyph"/><glyphRef xlink:href="#glyph"/><cursor xlink:href="cursor.svg"/><font-face-uri xlink:href="font.svg"/></svg>',
    '<svg><rect xlink:href="#unused"/></svg>',

    '<svg><use href="#icon"/></svg>',
    '<svg xmlns:xlink="http://www.w3.org/1999/xlink"/>',
    '<svg xmlns:xlink="urn:custom"><use xlink:href="#icon"/></svg>',
    '<svg xmlns:c="urn:custom"><use c:href="#icon"/></svg>',
    '<svg><foreignObject><a xmlns="http://www.w3.org/1999/xhtml" xlink:href="#icon"/></foreignObject></svg>',
  ],
  invalid: [
    {
      code: '<svg><image xlink:href="one.png"><set attributeName="xlink:href" to="two.png"/></image></svg>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<svg xmlns:l="http://www.w3.org/1999/xlink"><image id="image" l:href="one.png"/><set href="#image" attributeName="l:href" to="two.png"/></svg>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<svg xmlns:l="http://www.w3.org/1999/xlink"><set href="#image" attributeName="l:href" to="two.png"/><image id="image" l:href="one.png"/></svg>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },

    {
      code: '<svg><use xlink:href="#icon"/></svg>',
      output: '<svg><use href="#icon"/></svg>',
      errors: [{ messageId: 'deprecated', data: { name: 'xlink:href' } }],
    },
    {
      code: "<svg><image xlink:href='image.png'/></svg>",
      output: "<svg><image href='image.png'/></svg>",
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg" xmlns:l="http://www.w3.org/1999/xlink"><s:use l:href="#icon"/></s:svg>',
      output:
        '<s:svg xmlns:s="http://www.w3.org/2000/svg" xmlns:l="http://www.w3.org/1999/xlink"><s:use href="#icon"/></s:svg>',
      errors: [{ messageId: 'deprecated', data: { name: 'l:href' } }],
    },
    {
      code: '<svg><use href="#icon" xlink:href="#icon"/></svg>',
      output: '<svg><use href="#icon" /></svg>',
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<svg><use xlink:href="&#35;icon" href="#icon"/></svg>',
      output: '<svg><use  href="#icon"/></svg>',
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<svg><use href="#new" xlink:href="#old"/></svg>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<svg><use href="" xlink:href="#old"/></svg>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<svg xmlns:l="http://www.w3.org/1999/xlink"><use xlink:href="#one" l:href="#two"/></svg>',
      output: null,
      errors: [{ messageId: 'deprecated' }, { messageId: 'deprecated' }],
    },
  ],
})
