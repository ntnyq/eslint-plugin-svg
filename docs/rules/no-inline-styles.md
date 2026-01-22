---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-inline-styles
description: Disallow inline style attribute usage.
since: v0.0.5
---

# svg/no-inline-styles

> Disallow inline style attribute usage.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports whenever an SVG element contains a `style` attribute.

Using classes or external styles is preferred to keep SVGs maintainable and cache-friendly.

## :wrench: Options

This rule has no options.

## :apple: Examples

::: correct

```xml
<svg>
  <rect class="box" width="10" height="10" />
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <rect width="10" height="10" style="fill: red;" />
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.5

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-inline-styles.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-inline-styles.test.ts)
