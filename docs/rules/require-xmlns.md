---
pageClass: rule-details
sidebarDepth: 0
title: svg/require-xmlns
description: Require the SVG namespace declaration on standalone SVG roots.
since: v0.2.0
---

# svg/require-xmlns

> Require the SVG namespace declaration on standalone SVG roots.

- This rule is not enabled in the `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This opt-in rule checks document-root `svg` elements in files whose lint filename ends in `.svg` (case-insensitive). Unprefixed roots must declare `xmlns="http://www.w3.org/2000/svg"`. Prefixed roots such as `s:svg` must declare the corresponding `xmlns:s` namespace instead.

The URI is exact and case-sensitive. XML character references are decoded before comparing it. An empty or incorrect namespace is reported. Nested SVG elements are skipped, so declarations inherited from a document root are sufficient.

Other filenames, including HTML and component processor fragments, are skipped. Only enable this rule for standalone XML SVG documents. No automatic fix is offered because namespace changes affect how the document is interpreted.

See [SVG namespaces](https://www.w3.org/TR/SVG2/struct.html#Namespace).

## :apple: Examples

::: correct

```xml
<svg xmlns="http://www.w3.org/2000/svg">
  <svg viewBox="0 0 10 10" />
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg viewBox="0 0 10 10" />
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.2.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/require-xmlns.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/require-xmlns.test.ts)
