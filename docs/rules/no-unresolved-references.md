---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-unresolved-references
description: Disallow unresolved document-local SVG references.
since: v0.2.0
---

# svg/no-unresolved-references

> Disallow unresolved document-local SVG references.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule checks fragment-only `href` and XLink href references on elements that define them, top-level plain `url(#id)` tokens in SVG presentation attributes (`fill`, `stroke`, `clip-path`, `mask`, `filter`, `marker`, `marker-start`, `marker-mid`, `marker-end`, `cursor`, and `color-profile`), and ID lists in `aria-labelledby` and `aria-describedby`.

Forward references are allowed. IDs are case-sensitive. XML character references and URL percent escapes are decoded once (malformed escapes stay literal); ARIA IDs are not URL-decoded or Unicode-trimmed. URL parsing removes ASCII tabs and newlines, including those introduced by XML character references. An unprefixed `href` takes precedence over an XLink href, including when empty. XLink aliases and SVG namespace prefixes are supported. Explicitly foreign elements are skipped, but their IDs can be referenced.

External URLs, empty fragments, SVG view and media-fragment specifications, and hrefs beneath a non-empty `xml:base` are skipped. CSS comments and conditional function arguments such as `var()` fallbacks are skipped individually; direct `url()` references alongside them are still checked. CSS stylesheets, inline styles, escaped CSS URLs, scripts, and dynamically injected IDs are outside this static check. Use `allowIds` for IDs supplied by the host document.

See [SVG URL references](https://www.w3.org/TR/SVG2/linking.html#URLReference).

## :wrench: Options

```json
{
  "svg/no-unresolved-references": ["error", { "allowIds": ["host-icon"] }]
}
```

- `allowIds`: `string[]` (default: `[]`). IDs allowed without a definition in this document.

## :apple: Examples

::: correct

```xml
<svg>
  <use href="#icon" />
  <g id="icon"><path d="M0 0h10" /></g>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <use href="#missing" />
  <path fill="url(#missing-gradient)" />
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.2.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-unresolved-references.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-unresolved-references.test.ts)
