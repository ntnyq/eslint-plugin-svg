---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-unknown-attributes
description: Disallow unknown SVG attribute names.
since: v0.2.0
---

# svg/no-unknown-attributes

> Disallow unknown SVG attribute names.

- This rule is not enabled in the `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports case-sensitive attribute names absent from the SVG 2 and SVG 1.1 attribute indexes and the SVG 2 presentation attribute table. Deprecated names remain recognized. It checks spelling, not whether a known attribute is applicable to a particular element or whether its value is valid.

`data-*`, `aria-*`, lowercase `on*` event attributes, namespace declarations, and namespaced attributes are allowed. Explicitly foreign elements are skipped. ARIA and event attribute names are not validated by this rule. `focusable` is accepted for existing SVG accessibility workflows.

A unique close spelling match, including a capitalization correction such as `viewbox` → `viewBox`, is offered as an editor suggestion. Suggestions are suppressed if the replacement attribute already exists. There is no automatic fix.

The rule is included in `strict`. Add project-specific unprefixed attributes to `allowAttributes`.

Sources: [SVG 2 presentation attributes](https://www.w3.org/TR/SVG2/styling.html#PresentationAttributes), [SVG 2 attribute index](https://www.w3.org/TR/SVG2/attindex.html), [SVG 1.1 attribute index](https://www.w3.org/TR/SVG11/attindex.html).

## :wrench: Options

```json
{
  "svg/no-unknown-attributes": ["error", { "allowAttributes": ["custom"] }]
}
```

- `allowAttributes`: `string[]` (default: `[]`). Additional case-sensitive names to allow.

## :apple: Examples

::: correct

```xml
<svg viewBox="0 0 10 10" data-icon="home" aria-label="Home">
  <path stroke="currentColor" stroke-width="2" />
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg viewbox="0 0 10 10">
  <path storke="red" />
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.2.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-unknown-attributes.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-unknown-attributes.test.ts)
