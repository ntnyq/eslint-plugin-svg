---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-invalid-path-data
description: Disallow invalid path data in SVG path elements.
since: v0.2.0
---

# svg/no-invalid-path-data

> Disallow invalid path data in SVG path elements.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule validates the static `d` attribute of SVG `path` elements. It checks the initial moveto, command names, complete parameter groups, finite numbers, comma placement, and arc flags (`0` or `1`). XML character references and SVG namespace prefixes are supported.

Both relative and absolute commands, repeated parameter groups, implicit lineto after moveto, exponents, adjacent signed coordinates (`M0-1`), adjacent decimals (`M.5.6`), and concatenated arc flags are supported. SVG 2 numbers must not end in a bare decimal point (`1.`).

An absent or empty `d`, `none`, and CSS-wide keywords are allowed. Zero-length segments, zero radii, and negative arc radii are accepted; this is a syntax check, not a geometry or rendering check.

CSS stylesheets, inline styles, animation values, and other elements are outside this rule. No fix is offered because the intended path cannot be inferred.

See [SVG path data grammar](https://www.w3.org/TR/SVG2/paths.html#PathDataBNF).

## :apple: Examples

::: correct

```xml
<svg>
  <path d="M0 0L10 10 20 0Z" />
  <path d="M.5.6A10 20 30 0140 50" />
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <path d="M0 0L10" />
  <path d="M0 0A10 20 30 2 1 40 50" />
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.2.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-invalid-path-data.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-invalid-path-data.test.ts)
