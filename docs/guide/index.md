# User Guide

## Install

::: code-group

```bash [npm]
npm i eslint-plugin-svg -D
```

```bash [yarn]
yarn add eslint-plugin-svg -D
```

```bash [pnpm]
pnpm add eslint-plugin-svg -D
```

:::

## Basic Usage

Highly recommended to use `eslint.config.mjs` as config file.

```ts [eslint.config.mjs] twoslash
import pluginSvg from 'eslint-plugin-svg'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  ...pluginSvg.configs.recommended,
  // Other configs...
]
```

### The recommended preset

The `recommended` config enables a subset of [the rules](#rules) that should be most useful to most users.

## Advanced Usage

Override/add specific rules configurations.

_See also: [http://eslint.org/docs/user-guide/configuring](http://eslint.org/docs/user-guide/configuring)_.

```ts [eslint.config.mjs] twoslash
// @noErrors
import { createConfig } from 'eslint-plugin-svg'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  // other configs
  createConfig({
    // config name
    name: 'svg',

    // files to include
    files: ['**/*.svg'],

    // rules to enable
    rules: {},
  }),
]
```

## Options of `createConfig`

All fields of ESLint `Linter.Config` are supported, but bellow fields have default value:

### files

The files to be linted.

- Type: `string[]`
- Required: `false`
- Default: `['**/*.svg']`

### languageOptions.parser

The parser to use, this is set by default and can't be overridden.

- Type: `Linter.Parser`
- Required: `false`
- Default: [svg-eslint-parser](https://github.com/ntnyq/svg-eslint-parser)

### plugins

The plugins to use.

- Type: `Record<string, ESLint.Plugin>`
- Required: `false`
- Default: key `svg` set to this plugin
