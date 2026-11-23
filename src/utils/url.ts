/**
 * Apply URL parsing's C0/space trimming and ASCII tab/newline removal.
 */
export function normalizeUrl(value: string): string {
  let start = 0
  let end = value.length

  while (start < end && value.codePointAt(start)! <= 0x20) {
    start++
  }

  while (end > start && value.codePointAt(end - 1)! <= 0x20) {
    end--
  }

  return value.slice(start, end).replace(/[\t\n\r]/g, '')
}
