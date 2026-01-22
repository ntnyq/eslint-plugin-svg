---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-empty-title
description: Disallow empty title element.
since: v0.0.1
---

# svg/no-empty-title

> Disallow empty title element.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports when elememt title is empty.

## :wrench: Options

Nothing.

## :apple: Examples

::: correct

```xml
<svg>
  <title>foo</title>
</svg>
```

:::

::: correct

```xml eslint-check
<svg>
  <title>
    <circle r="10" />
  </title>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <title></title>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <title>
    <!-- foobar -->
  </title>
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.1

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-empty-title.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-empty-title.test.ts)
