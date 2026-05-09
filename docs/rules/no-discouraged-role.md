---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-discouraged-role
description: Disallow discouraged role values in SVG context.
since: v0.1.0
---

# svg/no-discouraged-role

> Disallow discouraged role values in SVG context.

- This rule is not enabled in the `recommended` config.
- This rule is enabled as `warn` in the `a11y` config.

## :book: Rule Details

This rule reports role values that are legal ARIA roles but discouraged for SVG usage.

Use this rule together with `svg/no-invalid-role`:

- `svg/no-invalid-role`: checks role validity.
- `svg/no-discouraged-role`: checks SVG-specific role suitability.

## :wrench: Options

```ts
export type Options = {
  /**
   * discouraged roles to check
   *
   * @default SVG discouraged role set
   */
  roles?: string[]
}
```

## :apple: Examples

::: correct

```xml
<svg role="img"></svg>
```

:::

::: incorrect

```xml eslint-check
<svg role="table"></svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-discouraged-role.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-discouraged-role.test.ts)
