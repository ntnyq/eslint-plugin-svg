import { Linter } from 'eslint'
import { describe, expect, it } from 'vitest'
import plugin from '../src'

describe('presets', () => {
  it('keeps standalone namespaces opt-in', () => {
    for (const config of Object.values(plugin.configs)) {
      expect(config[0]?.rules?.['svg/require-xmlns']).toBeUndefined()
    }
  })
  it('keeps href migration opt-in', () => {
    for (const config of Object.values(plugin.configs)) {
      expect(config[0]?.rules?.['svg/prefer-href']).toBeUndefined()
    }
  })
  it('checks path syntax in recommended and strict', () => {
    for (const config of [plugin.configs.recommended, plugin.configs.strict]) {
      const messages = new Linter().verify(
        '<svg viewBox="0 0 10 10"><path d="M0 0L10"/></svg>',
        config,
        { filename: 'test.svg' },
      )
      expect(messages.map(message => message.ruleId)).toEqual([
        'svg/no-invalid-path-data',
      ])
    }
  })
  it('checks unknown attributes only in strict', () => {
    expect(plugin.configs.strict[0]?.rules?.['svg/no-unknown-attributes']).toBe(
      'error',
    )
    expect(
      plugin.configs.recommended[0]?.rules?.['svg/no-unknown-attributes'],
    ).toBeUndefined()
  })
  it('checks reference target types without duplicate missing-ID reports', () => {
    for (const config of [plugin.configs.recommended, plugin.configs.strict]) {
      const messages = new Linter().verify(
        '<svg viewBox="0 0 10 10"><path clip-path="url(#p)" fill="url(#missing)"/><path id="p"/></svg>',
        config,
        { filename: 'test.svg' },
      )
      expect(messages.map(message => message.ruleId)).toEqual([
        'svg/no-invalid-reference-targets',
        'svg/no-unresolved-references',
      ])
    }
  })
  it('checks local references in recommended and strict', () => {
    for (const config of [plugin.configs.recommended, plugin.configs.strict]) {
      const messages = new Linter().verify(
        '<svg viewBox="0 0 10 10"><use href="#missing"/></svg>',
        config,
        { filename: 'test.svg' },
      )
      expect(messages.map(message => message.ruleId)).toEqual([
        'svg/no-unresolved-references',
      ])
    }
  })
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
