---
pageClass: rule-details
sidebarDepth: 0
title: svg/no-base64-data-url
description: Disallow data URLs (base64 by default) in SVG attributes.
since: v0.0.6
---

# svg/no-base64-data-url

> Disallow data URLs (base64 by default) in SVG attributes.

- This rule is not enabled in the `recommended` [config](https://github.com/ntnyq/eslint-plugin-svg#rules).

## :book: Rule Details

This rule reports SVG attributes that contain disallowed `data:` URLs.

By default, it only reports base64-encoded data URLs such as `data:image/png;base64,...`.

## :wrench: Options

```json
{
  "svg/no-base64-data-url": [
    "error",
    {
      "mode": "base64-only",
      "attributes": "*",
      "ignoreAttributes": [],
      "checkUrlFunction": true,
      "allowMimeTypes": []
    }
  ]
}
```

- `mode`: `'base64-only' | 'any-data-url'` (default: `'base64-only'`)
- `attributes`: `'*' | string[]` (default: `'*'`)
- `ignoreAttributes`: `string[]` (default: `[]`)
- `checkUrlFunction`: `boolean` (default: `true`)
- `allowMimeTypes`: `string[]` (default: `[]`)

## :apple: Examples

::: correct

```xml
<svg>
  <image href="https://example.com/logo.png" />
</svg>
```

```xml
<svg>
  <image href="data:image/svg+xml,%3Csvg%20/%3E" />
</svg>
```

```xml
<svg>
  <image href="data:image/svg+xml;base64,PHN2ZyAvPg==" />
</svg>
```

```json
{
  "svg/no-base64-data-url": ["error", { "allowMimeTypes": ["image/svg+xml"] }]
}
```

:::

::: incorrect

```xml eslint-check
<svg>
  <image href="data:image/png;base64,AAA=" />
</svg>
```

```xml eslint-check
<svg>
  <rect fill="url(data:image/png;base64,AAA=)" />
</svg>
```

```json
{
  "svg/no-base64-data-url": ["error", { "mode": "any-data-url" }]
}
```

```xml eslint-check
<svg>
  <image href="data:image/svg+xml,%3Csvg%20/%3E" />
</svg>
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-svg v0.0.6

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/src/rules/no-base64-data-url.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-svg/blob/main/tests/rules/no-base64-data-url.test.ts)
