---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-unsafe-href
description: Disallow unsafe href and xlink:href URL values.
since: v0.1.0
---

# svg/no-unsafe-href

> Disallow unsafe href and xlink:href URL values.

- 💼 This rule is enabled in the `security` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports unsafe URL values in `href` and `xlink:href` attributes.

XML character references are decoded before checking URLs, and URL tabs/newlines are normalized. For example, `java&#x73;cript:alert(1)` is reported too. Alternate prefixes bound to the XLink namespace are supported.

The following URL forms are disallowed:

- `javascript:` URLs
- remote URLs using `http:` or `https:`, including shortened forms and protocol-relative `//...`
- `data:` URLs

## :apple: Examples

::: correct

```xml
<svg>
  <use href="#icon-id" />
</svg>
```

```xml
<svg xmlns:xlink="http://www.w3.org/1999/xlink">
  <image xlink:href="./icons.svg#logo" />
</svg>
```

:::

::: incorrect

```xml eslint-check
<svg>
  <a href="javascript:alert(1)" />
</svg>
```

```xml eslint-check
<svg>
  <use href="http://example.com/icons.svg#id" />
</svg>
```

```xml eslint-check
<svg xmlns:xlink="http://www.w3.org/1999/xlink">
  <image xlink:href="data:image/png;base64,AAA=" />
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-unsafe-href.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-unsafe-href.test.ts)
