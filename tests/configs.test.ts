import { Linter } from 'eslint'
import { describe, expect, it } from 'vitest'
import plugin from '../src'

describe('presets', () => {
  it('reports empty groups only once in strict', () => {
    const messages = new Linter().verify(
      '<svg viewBox="0 0 10 10"><g/></svg>',
      plugin.configs.strict,
      { filename: 'test.svg' },
    )
    expect(messages.map(message => message.ruleId)).toEqual([
      'svg/no-empty-container',
    ])
  })
  it('reports deprecated elements without also calling them unknown', () => {
    const messages = new Linter().verify(
      '<svg viewBox="0 0 10 10"><font/></svg>',
      plugin.configs.recommended,
      { filename: 'test.svg' },
    )
    expect(messages.map(message => message.ruleId)).toEqual([
      'svg/no-deprecated',
    ])
  })
  it('rejects doctypes in the standalone security preset', () => {
    const messages = new Linter().verify(
      '<!DOCTYPE svg><svg/>',
      plugin.configs.security,
      { filename: 'test.svg' },
    )
    expect(messages.map(message => message.ruleId)).toEqual(['svg/no-doctype'])
  })
  it('accepts an explicitly named image in the a11y preset', () => {
    const messages = new Linter().verify(
      '<svg role="img" aria-label="Logo"/>',
      plugin.configs.a11y,
      { filename: 'test.svg' },
    )
    expect(messages).toEqual([])
  })
})
