import { describe, expect, it } from 'vitest'
import { deepMerge, isObjectNotArray } from '../../src/utils/merge'

describe('deepMerge', () => {
  it('preserves prototype-like keys as own data properties', () => {
    const input: Record<string, unknown> = JSON.parse(
      '{"__proto__":{"polluted":true},"constructor":{"custom":true}}',
    )
    const merged = deepMerge({}, input)
    expect(Object.getPrototypeOf(merged)).toBe(Object.prototype)
    expect(Object.hasOwn(merged, '__proto__')).toBe(true)
    expect(Object.getOwnPropertyDescriptor(merged, '__proto__')?.value).toEqual(
      {
        polluted: true,
      },
    )
    expect(merged.constructor).toEqual({ custom: true })
    expect(merged.polluted).toBeUndefined()
  })

  it('does not merge inherited properties into own properties', () => {
    const first: Record<string, unknown> = Object.create({
      nested: { inherited: true },
    })
    expect(deepMerge(first, { nested: { own: true } })).toEqual({
      nested: { own: true },
    })
  })

  const OBJECT_DEEP = {
    a: 1,
    b: {
      c: 2,
      d: 3,
    },
  }
  const OBJECT_SHALLOW = {
    b: {
      c: 3,
      e: 4,
    },
    f: 5,
  }
  const OBJECT_ARRAY = {
    b: [3, 4, 5],
    c: 2,
  }
  it('should merge two objects', () => {
    expect(deepMerge(OBJECT_DEEP, OBJECT_SHALLOW)).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": {
          "c": 3,
          "d": 3,
          "e": 4,
        },
        "f": 5,
      }
    `)
  })

  it('should merge object with array', () => {
    expect(deepMerge(OBJECT_DEEP, OBJECT_ARRAY)).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": [
          3,
          4,
          5,
        ],
        "c": 2,
      }
    `)
  })

  it('should merge with first empty', () => {
    expect(deepMerge({}, OBJECT_SHALLOW)).toMatchInlineSnapshot(`
      {
        "b": {
          "c": 3,
          "e": 4,
        },
        "f": 5,
      }
    `)
  })

  it('should merge with second empty', () => {
    expect(deepMerge(OBJECT_DEEP, {})).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": {
          "c": 2,
          "d": 3,
        },
      }
    `)
  })
})

describe('isObjectNotArray', () => {
  it('should return true for an object', () => {
    expect(isObjectNotArray({})).toBeTruthy()
  })
  it('should return false for an array', () => {
    expect(isObjectNotArray([])).toBeFalsy()
  })
})
