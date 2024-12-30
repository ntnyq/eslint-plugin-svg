---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-elements
description: Disallow elements by name.
since: v0.0.2
---

# svg/no-elements

> Disallow elements by name.

## :book: Rule Details

This rule reports when element name match given elements names.

## :wrench: Options

```ts
export type Options = {
  /**
   * elements to disallow
   *
   * @default []
   */
  elements?: string[]
}
```

## :apple: Examples

::: correct

```xml
<svg>
  <text>foo</text>
</svg>
```

:::

Examples of when option set to `elements: ['style', 'script']`:

::: incorrect

```xml eslint-check
<svg>
  <style></style>
  <script></script>
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.2

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-elements.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-elements.test.ts)
