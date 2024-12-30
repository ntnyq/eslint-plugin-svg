---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-empty-container
description: Disallow empty container element.
since: v0.0.1
---

# svg/no-empty-container

> Disallow empty container element.

## :book: Rule Details

This rule reports when container elememt is empty.

Built-in container elements:

- `a`
- `defs`
- `g`
- `marker`
- `mask`
- `missing-glyph`
- `pattern`
- `svg`
- `switch`
- `symbol`

See [MDN - SVG container elements](https://developer.mozilla.org/en-US/docs/Web/SVG/Element#container_elements) for detail.

## :wrench: Options

```ts
export type Options = {
  /**
   * container elements to be checked
   *
   * @default []
   */
  elements?: string[]

  /**
   * container elements to be ignored
   *
   * @default []
   */
  ignores?: string[]

  /**
   * whether ignore comments nodes
   *
   * @default true
   */
  ignoreComments?: boolean

  /**
   * whether ignore whitespace nodes
   *
   * @default true
   */
  ignoreWhitespace?: boolean
}
```

## :apple: Examples

::: correct

```xml
<svg>
  <a>
    <text>foo</text>
  </a>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <a></a>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <a>
    <!-- foobar -->
  </a>
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.1

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-empty-container.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-empty-container.test.ts)
