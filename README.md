# eslint-plugin-svg

[![CI](https://github.com/ntnyq/eslint-plugin-svg/workflows/CI/badge.svg)](https://github.com/ntnyq/eslint-plugin-svg/actions)
[![NPM VERSION](https://img.shields.io/npm/v/eslint-plugin-svg.svg)](https://www.npmjs.com/package/eslint-plugin-svg)
[![NPM DOWNLOADS](https://img.shields.io/npm/dy/eslint-plugin-svg.svg)](https://www.npmjs.com/package/eslint-plugin-svg)
[![CODECOV](https://codecov.io/github/ntnyq/eslint-plugin-svg/branch/main/graph/badge.svg)](https://codecov.io/github/ntnyq/eslint-plugin-svg)
[![LICENSE](https://img.shields.io/github/license/ntnyq/eslint-plugin-svg.svg)](https://github.com/ntnyq/eslint-plugin-svg/blob/main/LICENSE)

> Rules for consistent, readable and valid SVG files.

> [!CAUTION]
> Status: Work In Progress. Not ready for use.

## Install

```bash
npm install eslint-plugin-svg -D
```

```bash
yarn add eslint-plugin-svg -D
```

```bash
pnpm add eslint-plugin-svg -D
```

## Usage

Config in ESLint config files:

```ts
import pluginSvg from 'eslint-plugin-svg'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  // Other configs...
  ...pluginSvg.configs.recommended,
]
```

:apple: For advanced usaged, please check [Advanced Usage](https://eslint-plugin-svg.ntnyq.com/guide/#advanced-usage)

## Rules

💼 Configurations enabled in.\
✅ Set in the `recommended` preset.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

| Name                                                                               | Description                      | 💼  | 🔧  | 💡  |
| :--------------------------------------------------------------------------------- | :------------------------------- | :-: | :-: | :-: |
| [no-empty-title](https://eslint-plugin-svg.ntnyq.com/rules/no-empty-title)         | Disallow empty title element     | ✅  |     |     |
| [no-empty-desc](https://eslint-plugin-svg.ntnyq.com/rules/no-empty-desc)           | Disallow empty desc element      | ✅  |     |     |
| [no-empty-text](https://eslint-plugin-svg.ntnyq.com/rules/no-empty-text)           | Disallow empty text element      | ✅  |     |     |
| [no-empty-container](https://eslint-plugin-svg.ntnyq.com/rules/no-empty-container) | Disallow empty container element | ✅  |     |     |
| [no-deprecated](https://eslint-plugin-svg.ntnyq.com/rules/no-deprecated)           | Disallow deprecated elements     | ✅  |     |     |
| [no-elements](https://eslint-plugin-svg.ntnyq.com/rules/no-elements)               | Disallow elements by name        |     |     |     |
| [no-doctype](https://eslint-plugin-svg.ntnyq.com/rules/no-doctype)                 | Disallow doctype                 |     |     |     |

## License

[MIT](./LICENSE) License © 2024-PRESENT [ntnyq](https://github.com/ntnyq)
