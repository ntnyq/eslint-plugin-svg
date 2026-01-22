---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-duplicate-ids
description: Disallow duplicate id attributes in SVG elements.
since: v0.0.6
---

# svg/no-duplicate-ids

> Disallow duplicate id attributes in SVG elements.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports an error when multiple elements within an SVG document have the same `id` attribute.

IDs must be unique within a document to ensure proper element referencing and avoid unexpected behavior.

## :wrench: Options

Nothing.

## :apple: Examples

::: correct

```xml
<svg>
  <circle id="circle1" />
  <rect id="rect1" />
</svg>
```

:::

::: correct

```xml
<svg id="root">
  <g id="group">
    <circle id="circle1" />
  </g>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <circle id="shape" />
  <rect id="shape" />
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg id="root">
  <g id="group">
    <circle id="root" />
  </g>
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.6

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-duplicate-ids.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-duplicate-ids.test.ts)
