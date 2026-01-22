---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-script-tags
description: Disallow script elements in SVG.
since: v0.0.5
---

# svg/no-script-tags

> Disallow script elements in SVG.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports any usage of the `<script>` element inside SVG.

Inline scripts increase security risk (XSS) and make SVGs harder to sandbox and cache.

## :wrench: Options

This rule has no options.

## :apple: Examples

::: correct

```xml
<svg>
  <rect width="10" height="10" />
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <script>alert('xss')</script>
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.5

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-script-tags.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-script-tags.test.ts)
