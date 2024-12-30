export function resolveOptions<T extends Record<string, any>>(options?: [T]) {
  return (options?.[0] || {}) as T
}
