---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-comments
description: Disallow comments in SVG files.
since: v0.0.6
---

# svg/no-comments

> Disallow comments in SVG files.

## :book: Rule Details

This rule reports when SVG files contain comments.

While comments can be useful during development, they may not be desired in production SVG files as they increase file size and can expose implementation details.

## :wrench: Options

Nothing.

## :apple: Examples

::: correct

```xml
<svg>
  <circle r="10" />
  <rect width="20" height="20" />
</svg>
```

:::

::: correct

```xml
<svg>
  <g>
    <text>Hello</text>
  </g>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <!-- This is a comment -->
  <circle r="10" />
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <!-- First comment -->
  <circle r="10" />
  <!-- Second comment -->
  <rect width="20" height="20" />
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.6

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-comments.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-comments.test.ts)
