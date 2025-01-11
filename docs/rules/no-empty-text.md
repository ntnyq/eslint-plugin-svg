---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-empty-text
description: Disallow empty text element.
since: v0.0.1
---

# svg/no-empty-text

> Disallow empty text element.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports when elememt text is empty.

## :wrench: Options

Nothing.

## :apple: Examples

::: correct

```xml
<svg>
  <text>foo</text>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <text></text>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <text>
    <!-- foobar -->
  </text>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <text>
    <circle r="10" />
  </text>
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.1

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-empty-text.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-empty-text.test.ts)
