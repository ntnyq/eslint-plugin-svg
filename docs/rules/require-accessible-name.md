---
pageClass: rule-details
sidebarDepth: 0
title: svg/require-accessible-name
description: Require accessible names for root SVG and role="img" SVG elements.
since: v0.1.0
---

# svg/require-accessible-name

> Require accessible names for root SVG and role="img" SVG elements.

- 💼 This rule is enabled in the `a11y` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule requires an accessible name for:

- root `<svg>` elements
- nested `<svg>` elements with `role="img"`

An SVG is considered named when at least one of the following exists:

- non-empty `<title>...</title>` child
- non-empty `aria-label`
- non-empty `aria-labelledby`

## :apple: Examples

::: correct

```xml
<svg>
  <title>Close icon</title>
  <path d="M0 0h10v10z" />
</svg>
```

```xml
<svg aria-label="Search">
  <path d="M0 0h10v10z" />
</svg>
```

```xml
<svg>
  <g id="icon-name">Download</g>
  <svg role="img" aria-labelledby="icon-name">
    <path d="M0 0h10v10z" />
  </svg>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <path d="M0 0h10v10z" />
</svg>
```

```xml eslint-check
<svg>
  <svg role="img">
    <path d="M0 0h10v10z" />
  </svg>
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/require-accessible-name.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/require-accessible-name.test.ts)
