/**
 * Resolve rule options by taking the first runtime option object,
 * then falling back to default options.
 *
 * @param options - context.options
 * @param defaultOptions - default options
 * @returns - resolved options
 */
export function resolveOptions<T>(options?: [T], defaultOptions?: T) {
  /* v8 ignore next guard by eslint */
  return (options?.[0] || defaultOptions) as T
}
