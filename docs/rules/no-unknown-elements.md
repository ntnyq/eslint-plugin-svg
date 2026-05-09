---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-unknown-elements
description: Disallow non-standard SVG elements.
since: v0.1.0
---

# svg/no-unknown-elements

> Disallow non-standard SVG elements.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports element names that are not in the SVG standard element list.

The rule uses the plugin's built-in `ALL_ELEMENTS` constant as the source of truth.

## :apple: Examples

::: correct

```xml
<svg>
  <g>
    <path d="M0 0h10v10z" />
  </g>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <custom-node />
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-unknown-elements.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-unknown-elements.test.ts)
