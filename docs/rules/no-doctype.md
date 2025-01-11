---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-doctype
description: Disallow doctype.
since: v0.0.2
---

# svg/no-doctype

> Disallow doctype.

- 💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports when svg includes a DOCTYPE.

References:

- [StackOverflow - XML declaration and DOCTYPE](https://stackoverflow.com/a/38172170/9533579)

## :wrench: Options

Nothing.

## :apple: Examples

::: correct

```xml
<svg>
  <text>foo</text>
</svg>
```

:::

::: incorrect

```xml eslint-check
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg>
  <text>foo</text>
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.2

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-doctype.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-doctype.test.ts)
