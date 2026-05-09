---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-event-handlers
description: Disallow inline event handler attributes in SVG.
since: v0.0.5
---

# svg/no-event-handlers

> Disallow inline event handler attributes in SVG.

- This rule is not enabled in the `recommended` config.
- This rule is enabled in the `security` and `strict` configs.

## :book: Rule Details

This rule reports any attribute on SVG elements whose name starts with `on`, such as `onclick` or `onload`.

Inline event handlers carry security risks (e.g., XSS) and make behavior harder to audit.

### Options

- `ignoreAttributes`: `string[]` — exact attribute names to ignore.
- `ignorePatterns`: `string[]` — regular expression patterns used to ignore matching handler names.
- `ignores`: `string[]` — deprecated alias of `ignorePatterns` kept for backward compatibility.

Invalid regular expression patterns are reported by the rule.

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
    "svg/no-event-handlers": ["error", { "ignoreAttributes": ["onclick"] }]
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
