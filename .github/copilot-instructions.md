# AI Coding Agent Instructions for eslint-plugin-svg

## Project Overview

This is an ESLint plugin providing linting rules for SVG files. The plugin uses the **svg-eslint-parser** to parse SVG content and report issues via standard ESLint rule interfaces.

**Key Architecture:**

- **Entry Point:** [src/index.ts](../src/index.ts) - exports `plugin` object with `rules`, `configs`, and `meta`
- **Rule Framework:** Custom wrapper `createESLintRule()` ([src/utils/createRule.ts](../src/utils/createRule.ts)) that handles option merging and default values
- **Parser:** `svg-eslint-parser` (external dependency) - provides AST with `Tag`, `Text`, and other SVG-specific node types
- **Presets:** [src/configs/index.ts](../src/configs/index.ts) exports `recommended` config with 7 enabled rules
- **Tests:** Vitest with `eslint-vitest-rule-tester` wrapper ([tests/internal.ts](../tests/internal.ts)) configured for SVG parser

## Critical Developer Workflows

### Build & Deployment

- **Build:** `pnpm run build` (uses tsdown, generates `dist/` with `.d.ts` files)
- **Watch mode:** `pnpm run dev`
- **Deploy:** `pnpm run deploy` (builds + builds docs site)
- **Release:** `pnpm run release:check` (lints + typechecks + tests), then `pnpm run release:version` (bumps version)

### Testing & Validation

- **Test:** `pnpm run test` (watches by default in dev, single run in CI)
- **Lint:** `pnpm run lint` (ESLint check)
- **Typecheck:** `pnpm run typecheck`
- **Test pattern:** Use `run()` helper from [tests/internal.ts](../tests/internal.ts) with `valid`/`invalid` test cases and `$` template function for SVG code

## Project-Specific Patterns

### Creating New Rules

All rules follow a standardized pattern using `createESLintRule()`:

1. **Export `RULE_NAME` and types** (`MessageIds`, `Options`)
2. **Define meta object** with `type`, `docs`, `schema` (JSON Schema for options), and `messages`
3. **Implement `create()` function** with `RuleListener` handling SVG node types:
   - Common node types: `Tag` (SVG elements), `Text` (text content), `Attribute`
   - Access node properties: `node.name` (element name), `node.children`, `node.children[x].value`
4. **Use `resolveOptions()`** for single-option rules ([src/utils/resolveOptions.ts](../src/utils/resolveOptions.ts))
5. **Reference constants** from [src/constants/](../src/constants/) (e.g., `DEPRECATED_ELEMENTS`, `CONTAINER_ELEMENTS`, `ALL_ELEMENTS`, `VALID_ROLES`)

**Example:** [src/rules/no-empty-title.ts](../src/rules/no-empty-title.ts) (simple, no options) vs [src/rules/no-elements.ts](../src/rules/no-elements.ts) (with options)

### Rule Registration

Rules are auto-indexed in [src/rules/index.ts](../src/rules/index.ts) - export from rule file and add to the rules object.

### Option Handling

- **`defaultOptions`:** Must match `Options` type (array, even for single objects: `[{ key: value }]`)
- **`resolveOptions(context.options, defaultOptions)`:** Merges user options with defaults (deep-merges objects, overwrites arrays)
- **Schema:** JSON Schema in `meta.schema` - validates user config; use `properties`, `type`, `items`, `additionalProperties: false`

### Testing Rules

- Use `run()` from [tests/internal.ts](../tests/internal.ts) - automatically configures svg-eslint-parser
- Use `$` template function (unindent) for readable SVG test code
- Provide `filename`, `code`, and optionally `options` and `errors()` assertion
- [tests/rules/no-deprecated.test.ts](../tests/rules/no-deprecated.test.ts) shows pattern with error snapshots

## Key Dependencies & Integration Points

- **svg-eslint-parser:** Parses SVG, provides AST node types and parser config
- **ESLint 9.5.0+:** Latest ESLint API (FlatConfig format)
- **tsdown:** Builds TypeScript → JavaScript + `.d.ts`; configured to handle `dts: true` in [tsdown.config.ts](../tsdown.config.ts)
- **Husky + commit hooks:** Prepare stage runs before publish

## Important Conventions

- **File naming:** Rules are `kebab-case`, exported with `RULE_NAME` constant
- **SVG element handling:** Names may be camelCase or kebab-case in DOM; use `.toLowerCase()` if comparing
- **Deprecation list:** Maintain [src/constants/elements.ts](../src/constants/elements.ts) per MDN spec
- **Recommended preset:** Rules in [src/configs/index.ts](../src/configs/index.ts) with `recommended: true` meta are included
- **Type safety:** Strict TypeScript; all rules typed with `MessageIds` and `Options` generics

## Documentation

- Docs site in `docs/` (Vite + VitePress)
- Rule docs: `docs/rules/{rule-name}.md` - auto-referenced in README table
- `pnpm docs:dev` for local preview
