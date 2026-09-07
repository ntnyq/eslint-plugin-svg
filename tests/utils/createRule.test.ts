import { Linter } from 'eslint'
import * as parser from 'svg-eslint-parser'
import { describe, expect, it } from 'vitest'
import { createESLintRule } from '../../src/utils/createRule'

describe('createESLintRule', () => {
  it('exposes and merges top-level defaults without depending on ESLint default merging', () => {
    const received: unknown[] = []
    const defaults = {
      nested: { first: true, second: true },
      values: ['default'],
    }
    const rule = createESLintRule<
      [{ nested?: { first?: boolean; second?: boolean }; values?: string[] }],
      'invalid'
    >({
      name: 'test-defaults',
      meta: {
        type: 'problem',
        docs: { description: 'test' },
        schema: [{ type: 'object' }],
        messages: { invalid: 'invalid' },
      },
      defaultOptions: [defaults],
      create(_context, options) {
        received.push(options)
        return {}
      },
    })
    expect(rule.meta?.defaultOptions).toEqual([defaults])
    // Remove metadata to exercise our fallback used by ESLint versions before 9.15.
    const legacyRule = {
      ...rule,
      meta: { ...rule.meta, defaultOptions: undefined },
    }
    const config: Linter.Config = {
      files: ['**/*.svg'],
      languageOptions: { parser },
      plugins: { test: { rules: { defaults: legacyRule } } },
      rules: {
        'test/defaults': ['error', { nested: { first: false }, values: [] }],
      },
    }
    const linter = new Linter()
    expect(linter.verify('<svg/>', [config], { filename: 'test.svg' })).toEqual(
      [],
    )
    expect(
      linter.verify(
        '<svg/>',
        [{ ...config, rules: { 'test/defaults': 'error' } }],
        { filename: 'test.svg' },
      ),
    ).toEqual([])
    expect(received).toEqual([
      [{ nested: { first: false, second: true }, values: [] }],
      [defaults],
    ])
    expect(defaults).toEqual({
      nested: { first: true, second: true },
      values: ['default'],
    })
  })
})
