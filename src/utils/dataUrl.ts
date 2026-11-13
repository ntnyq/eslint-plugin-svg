import { normalizeUrl } from './url'

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
 * Parse a potential data URL and return normalized metadata.
 */
export function parseDataUrl(value: string): DataUrlInfo {
  // A fragment is not part of the data URL's metadata or payload.
  const rawValue = normalizeUrl(value).split('#', 1)[0]!
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

  const header = rawValue.slice(5, commaIndex).replace(/^ +| +$/g, '')
  const firstPart = header.split(';', 1)[0]!.replace(/ +$/g, '').toLowerCase()
  const mimeType = firstPart.includes('/') ? firstPart : ''

  const isBase64 = /; *base64$/i.test(header)

  return {
    isDataUrl: true,
    isBase64,
    mimeType,
  }
}
