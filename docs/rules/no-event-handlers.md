---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-event-handlers
description: Disallow inline event handler attributes in SVG.
since: v0.0.5
---

# svg/no-event-handlers

> Disallow inline event handler attributes in SVG.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports any attribute on SVG elements whose name starts with `on`, such as `onclick` or `onload`.

Inline event handlers carry security risks (e.g., XSS) and make behavior harder to audit.

### Options

- `ignores`: `string[]` — attribute names (as strings) that will be converted to regular expressions and used to ignore matching inline handlers. Useful for gradual adoption or custom prefixes.

## :apple: Examples

::: correct

```xml
<svg>
  <rect class="box" width="10" height="10" />
</svg>
```

:::

::: correct

```xml
<svg>
  <rect onclick="doSomething()" width="10" height="10" />
</svg>
```

with config:

```json
{
  "rules": {
    "svg/no-event-handlers": ["error", { "ignores": ["onclick"] }]
  }
}
```

:::

::: incorrect

```xml eslint-check
<svg>
  <rect onclick="alert('x')" width="10" height="10" />
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.5

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-event-handlers.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-event-handlers.test.ts)
