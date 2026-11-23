/**
 * @copyright {@link https://github.com/eslint-stylistic/eslint-stylistic}
 */

type ObjectLike<T = unknown> = Record<string, T>

/**
 * Check if the variable contains an object strictly rejecting arrays
 * @returns `true` if obj is an object
 */
export function isObjectNotArray(obj: unknown): obj is ObjectLike {
  return typeof obj === 'object' && obj != null && !Array.isArray(obj)
}

/**
 * Pure function - doesn't mutate either parameter!
 * Merges two objects together deeply, overwriting the properties in first with the properties in second
 * @param first - The first object
 * @param second - The second object
 * @returns a new object
 */
export function deepMerge(
  first: ObjectLike = {},
  second: ObjectLike = {},
): Record<string, unknown> {
  // get the unique set of keys across both objects
  const keys = new Set(Object.keys(first).concat(Object.keys(second)))

  // Define data properties so __proto__ cannot change the result's prototype.
  return Object.fromEntries(
    Array.from(keys, key => {
      const firstHasKey = Object.hasOwn(first, key)
      const secondHasKey = Object.hasOwn(second, key)
      const firstValue = first[key]
      const secondValue = second[key]

      if (firstHasKey && secondHasKey) {
        return [
          key,
          isObjectNotArray(firstValue) && isObjectNotArray(secondValue)
            ? deepMerge(firstValue, secondValue)
            : secondValue,
        ]
      }

      return [key, secondHasKey ? secondValue : firstValue]
    }),
  )
}
