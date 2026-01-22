---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-empty-groups
description: Disallow empty group element.
since: v0.0.5
---

# svg/no-empty-groups

> Disallow empty group element.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports when a `g` element is empty.

Comments and whitespace-only text nodes are ignored when determining emptiness.

## :wrench: Options

This rule has no options.

## :apple: Examples

::: correct

```xml
<svg>
  <g>
    <circle r="10" />
  </g>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <g></g>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <g>
    <!-- noop -->
  </g>
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.5

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-empty-groups.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-empty-groups.test.ts)
