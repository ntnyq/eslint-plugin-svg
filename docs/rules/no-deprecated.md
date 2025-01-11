---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-deprecated
description: Disallow deprecated elements.
since: v0.0.1
---

# svg/no-deprecated

> Disallow deprecated elements.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports when element is deprecated.

Deprecated elements:

- `altGlyph`
- `altGlyphDef`
- `altGlyphItem`
- `animateColor`
- `cursor`
- `font`
- `font-face`
- `font-face-format`
- `font-face-name`
- `font-face-src`
- `font-face-uri`
- `glyph`
- `glyphRef`
- `hkern`
- `missing-glyph`
- `tref`
- `vkern`

See [MDN - SVG deprecated elements](https://developer.mozilla.org/en-US/docs/Web/SVG/Element#obsolete_and_deprecated_elements) for detail.

## :wrench: Options

```ts
export type Options = {
  /**
   * allowed deprecated elements
   *
   * @default []
   */
  allowElements?: string[]
}
```

## :apple: Examples

::: correct

```xml
<svg>
  <text>foo</text>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <font></font>
  <font-face></font-face>
  <font-face-format></font-face-format>
  <font-face-name></font-face-name>
  <glyph></glyph>
  <cursor></cursor>
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.1

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-deprecated.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-deprecated.test.ts)
