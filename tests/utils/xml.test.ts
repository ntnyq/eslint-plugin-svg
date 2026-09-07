import { describe, expect, it } from 'vitest'
import { decodeXmlAttribute, decodeXmlReferences } from '../../src/utils/xml'

describe('XML references', () => {
  it('decodes XML entities and decimal/hexadecimal character references once', () => {
    expect(
      decodeXmlReferences('&lt;&gt;&amp;&apos;&quot;&#65;&#x41;&#x1F600;'),
    ).toBe('<>&\'"AA😀')
    expect(decodeXmlReferences('&amp;#58;&unknown;&AMP;&#0;&#x110000;')).toBe(
      '&#58;&unknown;&AMP;&#0;&#x110000;',
    )
  })
  it('normalizes literal whitespace before expanding references', () => {
    expect(decodeXmlAttribute('a\r\nb\tc&#9;d&#10;e')).toBe('a b c\td\ne')
  })
})
