---
pageClass: rule-details
sidebarDepth: 0
title: svg/prefer-href
description: Prefer href over deprecated XLink href attributes.
since: v0.2.0
---

# svg/prefer-href

> Prefer href over deprecated XLink href attributes.

- This rule is not enabled in the `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports XLink href attributes on SVG elements that define a modern unprefixed `href`, including namespace aliases. Legacy-only linking elements such as `tref`, `altGlyph`, `cursor`, and `font-face-uri` are skipped. It is opt-in because older rendering environments may require XLink compatibility.

When there is one XLink href and no unprefixed `href`, the automatic fix renames the attribute and preserves its value and quotes. When both attributes have the same XML-decoded value, the redundant XLink attribute is removed. Namespace declarations are preserved because other attributes may still use them.

Automatic fixes are disabled for documents containing SMIL href animations, including animations using XLink namespace aliases or targeting another element. Introducing an unprefixed `href` could override the animated XLink attribute. Migrate those attributes and animations together manually.

Conflicting values, missing values when both attributes exist, and multiple XLink aliases without an unprefixed `href` are reported without a fix. Explicitly foreign elements and attributes bound to non-XLink namespaces are skipped.

See [deprecated XLink reference attributes](https://www.w3.org/TR/SVG2/linking.html#XLinkRefAttrs).

## :apple: Examples

::: correct

```xml
<svg>
  <use href="#icon" />
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg xmlns:xlink="http://www.w3.org/1999/xlink">
  <use xlink:href="#icon" />
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.2.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/prefer-href.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/prefer-href.test.ts)
