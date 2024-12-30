---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-empty-title
description: Disallow empty title element.
since: v0.0.1
---

# svg/no-empty-title

> Disallow empty title element.

## :book: Rule Details

This rule reports when elememt title is empty.

::: correct

```xml
<svg>
  <title>foo</title>
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

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.1

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-empty-title.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-empty-title.test.ts)
