---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-invalid-role
description: Disallow invalid value of role attribute.
since: v0.0.4
---

# svg/no-invalid-role

> Disallow invalid value of role attribute.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports when attribute role value is invalid.

See [MDN - WAI-ARIA Roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) for detail.

## :wrench: Options

```ts
export type Options = {
  /**
   * allowed roles
   *
   * @default []
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
<svg role="foobar"></svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <title role="foobar">foobar</title>
</svg>
```

:::

When options `roles: ['list']` is set:

::: incorrect

```xml eslint-check
<svg>
  <circle role="img" r="10" />
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.4

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-invalid-role.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-invalid-role.test.ts)
