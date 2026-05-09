---
pageClass: rule-details
sidebarDepth: 0
title: svg/prefer-current-color
description: Prefer currentColor for fill and stroke in icon SVGs.
since: v0.1.0
---

# svg/prefer-current-color

> Prefer currentColor for fill and stroke in icon SVGs.

- This rule is not enabled in the `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule encourages icon-friendly SVG coloring by preferring `currentColor` over hardcoded colors for paint attributes.

By default, it checks `fill` and `stroke` values.

## :wrench: Options

```json
{
  "svg/prefer-current-color": [
    "warn",
    {
      "attributes": ["fill", "stroke"],
      "ignoreValues": ["none", "transparent"],
      "allowColors": []
    }
  ]
}
```

- `attributes`: `('fill' | 'stroke')[]` (default: `['fill', 'stroke']`)
- `ignoreValues`: `string[]` (default: `['none', 'transparent']`)
- `allowColors`: `string[]` (default: `[]`)

## :apple: Examples

::: correct

```xml
<svg>
  <path fill="currentColor" stroke="currentColor" />
</svg>
```

```xml
<svg>
  <path fill="none" stroke="transparent" />
</svg>
```

```json
{
  "svg/prefer-current-color": ["warn", { "allowColors": ["#000000"] }]
}
```

:::

::: incorrect

```xml eslint-check
<svg>
  <path fill="#111111" />
</svg>
```

```xml eslint-check
<svg>
  <path stroke="red" />
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/prefer-current-color.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/prefer-current-color.test.ts)
