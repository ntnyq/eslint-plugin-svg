export interface DataUrlInfo {
  /**
   * whether the value is a valid data URL with header and payload separator
   */
  isDataUrl: boolean
  /**
   * whether the data URL contains the base64 flag in metadata
   */
  isBase64: boolean
  /**
   * normalized MIME type extracted from the data URL metadata
   */
  mimeType: string
}

/**
 * Normalize text for case-insensitive URL checks.
 */
function normalize(value: string): string {
  return value.trim().toLowerCase()
}

/**
 * Parse a potential data URL and return normalized metadata.
 */
export function parseDataUrl(value: string): DataUrlInfo {
  const rawValue = value.trim()
  const lowerValue = rawValue.toLowerCase()

  if (!lowerValue.startsWith('data:')) {
    return {
      isDataUrl: false,
      isBase64: false,
      mimeType: '',
    }
  }

  const commaIndex = rawValue.indexOf(',')

  if (commaIndex === -1) {
    return {
      isDataUrl: false,
      isBase64: false,
      mimeType: '',
    }
  }

  const header = rawValue.slice(5, commaIndex)
  const parts = header.split(';').map(part => normalize(part))
  const firstPart = parts[0] ?? ''
  const mimeType = firstPart.includes('/') ? firstPart : ''

  const isBase64 = parts.includes('base64')

  return {
    isDataUrl: true,
    isBase64,
    mimeType,
  }
}
