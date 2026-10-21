import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-unknown-attributes'
import { run } from '../internal'
import type { Options } from '../../src/rules/no-unknown-attributes'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    '<svg><text white-space="pre" text-overflow="ellipsis">x</text></svg>',

    '<svg data-图标="home"/>',
    '<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M0 0" stroke-width="2" fill="none"/></svg>',
    '<svg data-icon="home" aria-label="Home" role="img" focusable="false" tabindex="0"/>',
    '<svg xml:lang="en" xmlns:inkscape="urn:inkscape" inkscape:label="Icon"/>',
    '<svg><use xlink:href="#icon"/></svg>',
    '<svg onclick="run()" onpointerdown="run()"/>',
    '<svg><font-face units-per-em="1000"/><animate attributeName="x" repeatCount="indefinite"/><feGaussianBlur stdDeviation="2"/></svg>',
    '<svg><path paint-order="stroke fill" vector-effect="non-scaling-stroke"/><text dominant-baseline="middle" text-anchor="middle"/></svg>',
    '<svg><foreignObject><div xmlns="http://www.w3.org/1999/xhtml" contenteditable="true"/></foreignObject></svg>',
    '<s:svg xmlns:s="http://www.w3.org/2000/svg" viewBox="0 0 10 10"/>',
    {
      code: '<svg custom="value"/>',
      options: [{ allowAttributes: ['custom'] }],
    },
  ],
  invalid: [
    {
      code: '<svg viewbox="0 0 10 10"/>',
      output: null,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('unknown')
        expect(errors[0]?.suggestions?.[0]).toMatchObject({
          messageId: 'replace',
          desc: "Replace 'viewbox' with 'viewBox'",
          fix: { range: [5, 12], text: 'viewBox' },
        })
      },
    },
    {
      code: '<svg><path storke="red"/></svg>',
      output: null,
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('unknown')
        const suggestion = errors[0]?.suggestions?.[0]
        expect(suggestion?.desc).toBe("Replace 'storke' with 'stroke'")
        const code = '<svg><path storke="red"/></svg>'
        expect(
          suggestion
            && code.slice(0, suggestion.fix.range[0])
              + suggestion.fix.text
              + code.slice(suggestion.fix.range[1]),
        ).toBe('<svg><path stroke="red"/></svg>')
      },
    },
    {
      code: '<svg viewBox="0 0 10 10" viewbox="0 0 20 20"/>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('unknown')
        expect(errors[0]?.suggestions).toBeUndefined()
      },
    },
    {
      code: '<svg completely-unknown="value"/>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('unknown')
        expect(errors[0]?.suggestions).toBeUndefined()
      },
    },
    {
      code: '<svg Custom="value"/>',
      options: [{ allowAttributes: ['custom'] }],
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('unknown')
      },
    },
    {
      code: '<s:svg xmlns:s="http://www.w3.org/2000/svg" viewbox="0 0 10 10"/>',
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0]?.messageId).toBe('unknown')
        expect(errors[0]?.suggestions?.[0]?.fix.text).toBe('viewBox')
      },
    },
  ],
})
