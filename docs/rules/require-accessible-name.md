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

SVGs hidden by `aria-hidden="true"` (including on ancestors) and non-focusable decorative SVGs with `role="none"` or `role="presentation"` are excluded. A presentational role is not treated as decorative when ARIA attributes override it.

The rule resolves names from static markup:

- non-empty `<title>...</title>` child
- non-empty `aria-label`
- `aria-labelledby` references to existing IDs with non-empty text alternatives

References may point forward in the document. The first recognized role token is used, so `role="unknown img"` also requires a name on a nested SVG. XML character references are decoded before checking text.

Valid `aria-labelledby` references take precedence over `aria-label` and `<title>`, even when the referenced content is empty. Missing references allow those alternatives to be checked. Chained `aria-labelledby` references are not followed, preventing cycles from creating a false name.

This is a static markup check, not a complete browser accessibility-tree computation. It does not evaluate stylesheets, generated CSS content, or script-generated labels.

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
