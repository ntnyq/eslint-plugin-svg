# Repository Guidelines

## Project Structure & Module Organization

The package is an ESM TypeScript ESLint plugin. `src/index.ts` exposes the plugin, while `src/rules/` contains one rule per kebab-case file and `src/rules/index.ts` registers them. Shared factories and helpers live in `src/utils/`; presets are defined in `src/configs/`; constants and public types have dedicated directories. Tests mirror the source under `tests/rules/` and `tests/utils/`, with `tests/internal.ts` configuring `svg-eslint-parser`. Rule documentation belongs in `docs/rules/`; VitePress configuration and static assets live under `docs/.vitepress/` and `docs/public/`. Treat `dist/` as generated output.

## Build, Test, and Development Commands

Use the pnpm version declared in `package.json` and a supported Node release (`^22.13.0` or `>=24`).

- `pnpm install --frozen-lockfile` installs the workspace exactly as CI does.
- `pnpm dev` rebuilds the package in watch mode.
- `pnpm build` generates JavaScript and declarations with tsdown.
- `pnpm lint` checks source, tests, configuration, Markdown, and SVG files.
- `pnpm typecheck` runs strict TypeScript checks without emitting files.
- `pnpm test` runs the Vitest suite once; add a path to target one file.
- `pnpm docs:dev` serves the documentation locally; `pnpm docs:build` verifies it.
- `pnpm release:check` runs linting, typechecking, and tests together.

## Coding Style & Naming Conventions

Follow `.editorconfig`: two-space indentation, LF line endings, UTF-8, and a final newline. Match the existing TypeScript style: single quotes, no semicolons, ESM imports, explicit type-only imports, and strict typing. ESLint uses `@ntnyq/eslint-config`; Prettier handles CSS and HTML formatting. Rule identifiers, filenames, tests, and docs must share the same kebab-case name, such as `require-viewbox`. Preserve alphabetical ordering around `@keep-sorted` comments.

## Testing Guidelines

Use Vitest and `eslint-vitest-rule-tester`. Each rule test should include representative `valid` and `invalid` SVG cases. Assert diagnostics and fixer output, using inline snapshots where useful. Name files `<rule-name>.test.ts`. There is no configured coverage threshold, but every behavior change should include regression coverage.

## Rule Change Checklist

When adding a rule, update its implementation, `src/rules/index.ts`, applicable presets in `src/configs/index.ts`, its test, `docs/rules/<name>.md`, and the rule tables in `docs/rules/index.md` and `README.md`.

## Commit & Pull Request Guidelines

Follow the history’s Conventional Commit style: `feat: add new rule ...`, `chore(deps): ...`, or `feat!:` for breaking changes. Keep commits focused and imperative. Pull requests should explain user-visible behavior, link relevant issues, list validation performed, and update tests and docs together. Include screenshots only for documentation UI changes.
