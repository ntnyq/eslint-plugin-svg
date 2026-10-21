---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-invalid-reference-targets
description: Disallow SVG references to elements of an invalid type.
since: v0.2.0
---

# svg/no-invalid-reference-targets

> Disallow SVG references to elements of an invalid type.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule checks the type of an existing, document-local reference target. Missing IDs are handled by `svg/no-unresolved-references`, so enabling both rules does not duplicate missing-reference reports.

| Reference | Allowed targets |
| --- | --- |
| `fill`, `stroke` | `linearGradient`, `radialGradient`, `pattern` |
| `clip-path` | `clipPath` |
| `filter` | `filter` |
| `marker`, `marker-start`, `marker-mid`, `marker-end` | `marker` |
| `linearGradient` / `radialGradient` href | Another `linearGradient` or `radialGradient` |
| `pattern` href | Another `pattern` |
| `filter` href | Another `filter` |
| `textPath` href | `circle`, `ellipse`, `line`, `path`, `polygon`, `polyline`, `rect` |
| `mpath` href | `path` |
| `use` href | An SVG element |

SVG and XLink namespace aliases, forward references, XML character references, and percent-encoded fragments are supported. Duplicate IDs resolve to the first matching element. The reference extraction boundaries are the same as [no-unresolved-references](/rules/no-unresolved-references).

Navigation links, ARIA ID references, image resources (including masks and cursors), external URLs, CSS styles, and reference cycles are outside this type check.

See [SVG valid URL targets](https://www.w3.org/TR/SVG2/linking.html#URLTarget).

## :apple: Examples

::: correct

```xml
<svg>
  <path clip-path="url(#clip)" />
  <clipPath id="clip"><rect width="10" height="10" /></clipPath>
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <path clip-path="url(#shape)" />
  <path id="shape" d="M0 0h10" />
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.2.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-invalid-reference-targets.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-invalid-reference-targets.test.ts)
