---
pageClass: rule-details
sidebarDepth: 0
title: svg/require-viewbox
description: Require SVG elements to define a viewBox attribute.
since: v0.0.5
---

# svg/require-viewbox

> Require SVG elements to define a viewBox attribute.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports any `<svg>` element that omits the `viewBox` attribute, provides an empty value, or has an invalid `viewBox` format.

A proper viewBox keeps SVGs scalable and ensures responsive rendering.

## :wrench: Options

```ts
export type Options = {
  /**
   * whether to validate viewBox format as four finite numbers with
   * positive width and height
   *
   * @default true
   */
  validateFormat?: boolean
}
```

## :apple: Examples

::: correct

```xml
<svg viewBox="0 0 100 100">
  <rect width="10" height="10" />
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <rect width="10" height="10" />
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg viewBox="foo">
  <rect width="10" height="10" />
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.5

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/require-viewbox.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/require-viewbox.test.ts)
