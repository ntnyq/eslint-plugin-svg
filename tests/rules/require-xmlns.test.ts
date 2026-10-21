import rule, { RULE_NAME } from '../../src/rules/require-xmlns'
import { run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    { filename: 'icon.svg', code: '<svg xmlns="http://www.w3.org/2000/svg"/>' },
    {
      filename: 'icon.svg',
      code: '<svg xmlns="http://www.w3.org/2000/svg"><svg/></svg>',
    },
    {
      filename: 'icon.svg',
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg"/>',
    },
    {
      filename: 'icon.svg',
      code: '<svg xmlns="http://www.w3.org/2000/&#115;vg"/>',
    },
    {
      filename: 'icon.svg',
      code: '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"/>',
    },
    { filename: 'inline.html', code: '<svg/>' },
    { filename: 'Component.vue/0.html', code: '<svg/>' },
    { filename: 'fragment.xml', code: '<svg/>' },
    {
      filename: 'icon.svg',
      code: '<html xmlns="http://www.w3.org/1999/xhtml"><svg/></html>',
    },
  ],
  invalid: [
    {
      filename: 'icon.svg',
      code: '<svg/>',
      errors: [{ messageId: 'missing', data: { name: 'xmlns' } }],
    },
    {
      filename: 'ICON.SVG',
      code: '<svg/>',
      errors: [{ messageId: 'missing' }],
    },
    {
      filename: 'icon.svg',
      code: '<svg><svg xmlns="http://www.w3.org/2000/svg"/></svg>',
      errors: [{ messageId: 'missing' }],
    },
    {
      filename: 'icon.svg',
      code: '<svg xmlns=""/>',
      errors: [{ messageId: 'invalid', data: { name: 'xmlns' } }],
    },
    {
      filename: 'icon.svg',
      code: '<svg xmlns="https://www.w3.org/2000/svg"/>',
      errors: [{ messageId: 'invalid' }],
    },
    {
      filename: 'icon.svg',
      code: '<svg xmlns=" http://www.w3.org/2000/svg "/>',
      errors: [{ messageId: 'invalid' }],
    },
    {
      filename: 'icon.svg',
      code: '<s:svg xmlns="http://www.w3.org/2000/svg"/>',
      errors: [{ messageId: 'missing', data: { name: 'xmlns:s' } }],
    },
    {
      filename: 'icon.svg',
      code: '<s:svg xmlns:s="urn:custom"/>',
      errors: [{ messageId: 'invalid', data: { name: 'xmlns:s' } }],
    },
  ],
})
