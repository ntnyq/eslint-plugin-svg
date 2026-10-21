import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-unresolved-references'
import { run } from '../internal'
import type { Options } from '../../src/rules/no-unresolved-references'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    '<svg><path fill="url(#icon/*variant)"/><linearGradient id="icon/*variant"/></svg>',

    '<svg><path fill="url(#&#160;paint)"/><linearGradient id="&#160;paint"/></svg>',
    '<svg><path fill="url(&quot;#bad&#10;string&quot;)"/></svg>',

    '<svg><use href="#a%ZZ"/><g id="a%ZZ"/></svg>',
    '<svg><use href="#%EF%BB%BFicon"/><g id="&#xFEFF;icon"/></svg>',
    '<svg><path fill="url(#a%2520b)"/><g id="a%20b"/></svg>',
    '<svg><path fill="url(#ok)"/><g id="ok"/></svg>',
    '<svg><path filter="var(--filter, url(#outside))"/></svg>',
    '<svg><path filter="env(custom, url(#outside))"/></svg>',
    '<svg><path fill="url(#ok) /* url(#outside) */"/><linearGradient id="ok"/></svg>',
    '<svg><path fill="url( &quot;#ok&quot; )"/><linearGradient id="ok"/></svg>',
    '<svg><path fill="url(&quot;#var(--paint)&quot;)"/><g id="var(--paint)"/></svg>',
    '<svg><path fill="url(#escaped\\69d)"/></svg>',
    '<svg><path fill="some-url(#outside)"/></svg>',

    '<svg><rect href="#ignored"/></svg>',
    '<svg><a href="#xywh=0,0,10,10"/><a href="#t=1,2"/></svg>',
    '<svg><use href="#ic&#9;on"/><g id="icon"/></svg>',
    '<svg><use href="#&#160;icon"/><g id="&#160;icon"/></svg>',
    '<svg aria-labelledby="&#160;label"><title id="&#160;label">Hi</title></svg>',
    '<svg><path fill="var(--paint, url(#missing))"/></svg>',
    '<svg><path fill="red /* url(#missing) */"/></svg>',
    '<svg><path filter="url(&quot;https://example.com/url(#missing)&quot;)"/></svg>',

    '<svg><use href="#icon"/><g id="icon"/></svg>',
    '<svg><path fill="url(#g) red"/><linearGradient id="g"/></svg>',
    '<svg><path fill="url( &quot;#g&quot; )"/><g id="g"/></svg>',
    '<svg><use xlink:href="#a%26b"/><g id="a&amp;b"/></svg>',
    '<svg><use href="&#35;icon"/><g id="icon"/></svg>',
    '<svg><use href="#%E5%9B%BE"/><g id="图"/></svg>',
    '<svg aria-labelledby="a b" aria-describedby="b"><title id="a">A</title><desc id="b">B</desc></svg>',
    '<svg><use href="icons.svg#icon"/><use href="https://example.com/#icon"/></svg>',
    '<svg><a href="#"/><a href="#svgView(viewBox(0,0,10,10))"/></svg>',
    '<svg><use href="#ok" xlink:href="#missing"/><g id="ok"/></svg>',
    '<svg><use href="" xlink:href="#missing"/></svg>',
    '<svg xml:base="icons.svg"><use href="#external"/></svg>',
    '<svg><foreignObject><div xmlns="http://www.w3.org/1999/xhtml" aria-labelledby="outside"/></foreignObject></svg>',
    '<svg xmlns:x="urn:custom"><use x:href="#outside"/></svg>',
    '<svg><path style="fill:url(#outside)"/><style>path { fill: url(#outside) }</style></svg>',
    '<svg><path fill="url(#a%20b)"/><g id="a b"/></svg>',
    {
      code: '<svg><use href="#host-icon"/></svg>',
      options: [{ allowIds: ['host-icon'] }],
    },
  ],
  invalid: [
    {
      code: '<svg><path filter="url(#icon/*variant) url(#missing)"/><filter id="icon/*variant"/></svg>',
      errors: [
        { messageId: 'unresolved', data: { id: 'missing', name: 'filter' } },
      ],
    },

    ...[
      '<svg><path filter="url(#missing) blur(var(--size))"/></svg>',
      '<svg><path fill="url(#missing) red/*comment*/"/></svg>',
      '<svg><path fill="url(#missing) red/*url(#ignored)*/"/></svg>',
      '<svg><use href="#bad%ZZ"/></svg>',
      '<svg><path fill="/* ignore url(#outside) */ url(#missing)"/></svg>',
      '<svg><path filter="blur(var(--size)) url(#missing)"/></svg>',
      '<svg><tref xlink:href="#missing"/></svg>',
      '<svg><tref href="#ignored" xlink:href="#missing"/></svg>',
      '<svg><path fill="url(#&#160;missing)"/></svg>',
      '<svg><use href="#missing"/></svg>',
      '<svg><use xlink:href="#missing"/></svg>',
      '<s:svg xmlns:s="http://www.w3.org/2000/svg" xmlns:l="http://www.w3.org/1999/xlink"><s:use l:href="#missing"/></s:svg>',
      '<svg><path fill="url(#missing)"/></svg>',
      '<svg><path stroke="URL(\'#missing\') red"/></svg>',
      '<svg><path clip-path="url(#missing)"/></svg>',
      '<svg><path mask="url(#missing)"/></svg>',
      '<svg><path marker-start="url(#missing)"/></svg>',
      '<svg><use href="#missing"/><g id="Missing"/></svg>',
    ].map(code => ({
      code,
      errors: [{ messageId: 'unresolved' }],
    })),
    {
      code: '<svg aria-labelledby="missing other missing"><path filter="url(#missing) url(#other)"/></svg>',
      errors(errors) {
        expect(errors.map(error => error.messageId)).toEqual(
          Array.from({ length: 4 }, () => 'unresolved'),
        )
        expect(errors[0]?.message).toContain("'missing'")
        expect(errors[1]?.message).toContain("'other'")
      },
    },
  ],
})
