import {
  decodeXmlAttribute,
  getAttributeValue,
  getParentElement,
  getSvgElementName,
  isHrefAttribute,
} from './xml'
import type { AST } from '../types'

export interface LocalReference {
  /**
   * Attribute containing the reference.
   */
  attribute: AST.AttributeNode
  /**
   * Decoded document-local target ID.
   */
  id: string
}

const URL_ATTRIBUTES = new Set([
  'clip-path',
  'color-profile',
  'cursor',
  'fill',
  'filter',
  'marker',
  'marker-end',
  'marker-mid',
  'marker-start',
  'mask',
  'stroke',
])
const IDREF_ATTRIBUTES = new Set(['aria-labelledby', 'aria-describedby'])

/**
 * SVG elements with a modern, unprefixed href attribute.
 */
export const SVG_HREF_ELEMENTS = new Set([
  'a',
  'animate',
  'animateMotion',
  'animateTransform',
  'discard',
  'feImage',
  'filter',
  'image',
  'linearGradient',
  'mpath',
  'pattern',
  'radialGradient',
  'script',
  'set',
  'textPath',
  'use',
])
const LEGACY_XLINK_ELEMENTS = new Set([
  'altGlyph',
  'animateColor',
  'color-profile',
  'cursor',
  'font-face-uri',
  'glyphRef',
  'tref',
])
const fragmentDecoder = new TextDecoder('utf-8', { ignoreBOM: true })

/**
 * Decode fragment-only URLs without treating SVG view specifications as IDs.
 */
function getFragmentId(value: string): string | undefined {
  value = value.replace(/[\t\n\r]/g, '')
  let start = 0
  let end = value.length
  // URL parsing trims C0 controls and ASCII spaces, not Unicode whitespace.
  while (start < end && value.codePointAt(start)! <= 0x20) {
    start++
  }
  while (end > start && value.codePointAt(end - 1)! <= 0x20) {
    end--
  }
  value = value.slice(start, end)
  if (!value.startsWith('#') || value.length === 1) {
    return undefined
  }
  // URL percent-decoding leaves malformed percent escapes literal and uses
  // replacement characters for malformed UTF-8, rather than throwing.
  const id = value
    .slice(1)
    .replace(/(?:%[\da-f]{2})+/gi, encoded =>
      fragmentDecoder.decode(
        Uint8Array.from(encoded.matchAll(/%([\da-f]{2})/gi), match =>
          Number.parseInt(match[1]!, 16),
        ),
      ),
    )
  return /^(?:(?:svgView|xpointer)\(|(?:xywh|t)=)/.test(id) ? undefined : id
}

/**
 * Inspect top-level plain url() functions without entering CSS strings,
 * comments or conditional fallback functions such as var() and env().
 */
function getCssUrls(value: string): string[] {
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
        depth === 0
        && previousName.toLowerCase() === 'url'
        && previousEnd === match.index
      ) {
        urlPattern.lastIndex = tokenPattern.lastIndex
        const url = urlPattern.exec(value)
        if (url) {
          const target = url[1] ?? url[2] ?? url[3] ?? ''
          if (!target.includes('\\')) {
            urls.push(target)
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

/**
 * A non-empty XML base can move fragment hrefs into another document.
 */
function hasXmlBase(node: AST.ElementNode): boolean {
  let current: AST.ElementNode | undefined = node
  while (current) {
    if (getAttributeValue(current, 'xml:base')) {
      return true
    }
    current = getParentElement(current)
  }
  return false
}

/**
 * Extract static references from SVG attributes, excluding CSS and scripts.
 */
export function getLocalReferences(node: AST.ElementNode): LocalReference[] {
  const elementName = getSvgElementName(node)
  if (elementName === null) {
    return []
  }
  const references: LocalReference[] = []
  const hasHref =
    SVG_HREF_ELEMENTS.has(elementName)
    && node.attributes.some(attribute => attribute.key?.value === 'href')
  for (const attribute of node.attributes) {
    if (!attribute.key || !attribute.value) {
      continue
    }
    const name = attribute.key.value
    const value = decodeXmlAttribute(attribute.value.value)
    let ids: string[] = []
    if (IDREF_ATTRIBUTES.has(name)) {
      ids = value.split(/[\t\n\r ]+/).filter(Boolean)
    } else if (isHrefAttribute(attribute)) {
      if (
        !SVG_HREF_ELEMENTS.has(elementName)
        && (name === 'href' || !LEGACY_XLINK_ELEMENTS.has(elementName))
      ) {
        continue
      }
      if ((hasHref && name !== 'href') || hasXmlBase(node)) {
        continue
      }
      const id = getFragmentId(value)
      if (id) {
        ids.push(id)
      }
    } else if (URL_ATTRIBUTES.has(name)) {
      for (const url of getCssUrls(value)) {
        const id = getFragmentId(url)
        if (id) {
          ids.push(id)
        }
      }
    }
    for (const id of new Set(ids)) {
      references.push({ attribute, id })
    }
  }
  return references
}
