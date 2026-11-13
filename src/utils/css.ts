/**
 * Decode CSS string escapes without interpreting XML or URL percent escapes.
 */
function decodeCssEscapes(value: string): string {
  return value.replace(
    /\\(?:([\da-f]{1,6})[\t\n\f\r ]?|\r\n|([\s\S]))/gi,
    (
      _match,
      hexadecimal: string | undefined,
      character: string | undefined,
    ) => {
      if (hexadecimal) {
        const codePoint = Number.parseInt(hexadecimal, 16)
        return codePoint === 0
          || codePoint > 0x10ffff
          || (codePoint >= 0xd800 && codePoint <= 0xdfff)
          ? '\u{FFFD}'
          : String.fromCodePoint(codePoint)
      }
      return character && !/[\n\r\f]/.test(character) ? character : ''
    },
  )
}

/**
 * Extract CSS url() tokens, skipping strings and comments outside URL bodies.
 * Nested functions are optional so reference checks can skip var() fallbacks.
 */
export function getCssUrls(
  value: string,
  options: { includeNested?: boolean; decodeEscapes?: boolean } = {},
): string[] {
  const urls: string[] = []
  let depth = 0
  let previousName = ''
  let previousEnd = -1
  // Consume URL bodies separately: comment markers inside an unquoted URL
  // are literal characters, rather than CSS comments.
  const urlPattern =
    /[\t\n\f\r ]*(?:"((?:[^"\\\n\r\f]|\\[\s\S])*)"|'((?:[^'\\\n\r\f]|\\[\s\S])*)'|((?:[^\t\n\f\r "'()\\]|\\(?:[\da-f]{1,6}[\t\n\f\r ]?|[^\da-f]))+))[\t\n\f\r ]*\)/iy
  const tokenPattern =
    /\/\*[\s\S]*?(?:\*\/|$)|"(?:[^"\\]|\\[\s\S])*(?:"|$)|'(?:[^'\\]|\\[\s\S])*(?:'|$)|(?:\\(?:[\da-f]{1,6}[\t\n\f\r ]?|[^\da-f])|[-\w\u{80}-\u{10FFFF}])+|[()]/giu
  let match: RegExpExecArray | null
  while ((match = tokenPattern.exec(value))) {
    const token = match[0]
    if (token === '(') {
      if (
        (depth === 0 || options.includeNested)
        && (options.decodeEscapes
          ? decodeCssEscapes(previousName)
          : previousName
        ).toLowerCase() === 'url'
        && previousEnd === match.index
      ) {
        urlPattern.lastIndex = tokenPattern.lastIndex
        const url = urlPattern.exec(value)
        if (url) {
          const target = url[1] ?? url[2] ?? url[3] ?? ''
          if (options.decodeEscapes || !target.includes('\\')) {
            urls.push(options.decodeEscapes ? decodeCssEscapes(target) : target)
          }
          tokenPattern.lastIndex = urlPattern.lastIndex
          previousName = ''
          previousEnd = -1
          continue
        }
      }
      depth++
    } else if (token === ')' && depth > 0) {
      depth--
    }
    previousName = token
    previousEnd = tokenPattern.lastIndex
  }
  return urls
}
