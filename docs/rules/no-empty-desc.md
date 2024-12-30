---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-empty-desc
description: Disallow empty desc element.
since: v0.0.1
---

# svg/no-empty-desc

> Disallow empty desc element.

## :book: Rule Details

This rule reports when elememt desc is empty.

::: correct

```xml
<svg>
  <desc>foo</desc>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <desc></desc>
</svg>
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.1

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-empty-desc.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-empty-desc.test.ts)
