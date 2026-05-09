# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 frontend using the App Router. Route pages, layouts, SEO files, and global styles live in `app/`. Reusable UI is in `components/`, organized by domain; shared primitives are under `components/_common/`, and layout providers/header/footer live in `components/_layout/`. Application logic belongs in `lib/`: API clients in `lib/api/`, React hooks in `lib/hooks/`, Zustand stores in `lib/store/`, shared types in `lib/types/`, Zod schemas in `lib/schemas/`, metadata helpers in `lib/metadata/`, and utilities in `lib/utils/`. Static assets and fonts are in `public/`. Storybook stories and assets live in `stories/`, with config in `.storybook/`.

## Build, Test, and Development Commands

Use Node.js `>=24.0.0` and pnpm.

- `pnpm install`: install dependencies from `pnpm-lock.yaml`.
- `pnpm dev`: start the local Next.js dev server.
- `pnpm build`: create a production build.
- `pnpm start`: run the production build locally.
- `pnpm lint`: run ESLint across the project.
- `pnpm storybook`: start Storybook on port `6006`.
- `pnpm build-storybook`: build static Storybook output.

Vitest browser testing is configured through Storybook in `vitest.config.ts`, but there is currently no `pnpm test` script.

## Coding Style & Naming Conventions

TypeScript runs in strict mode. Use the `@/*` path alias for root-relative imports. Follow Prettier settings: 2-space indentation, semicolons, single quotes, trailing commas where valid in ES5, and 80-character print width. Tailwind classes are ordered by `prettier-plugin-tailwindcss`.

Prefer existing naming patterns: hooks use `useXxx`, type definitions belong in `lib/types`, and reusable components should be placed in the closest domain folder or `components/_common/` when broadly shared.

## Testing Guidelines

Add or update Storybook stories for UI components with meaningful states, especially loading, empty, error, and interaction states. Before opening a PR, run `pnpm lint` and `pnpm build`. If adding direct automated tests, align them with the existing Vitest and Storybook browser setup rather than introducing a separate framework.

## Commit & Pull Request Guidelines

Commits follow Conventional Commits with these allowed types: `chore`, `docs`, `feat`, `fix`, `refactor`, `style`, `hotfix`, and `test`. Ticket scopes are commonly used, for example `feat(MP-707): add search filter` or `fix(MP-716): correct brand name`.

Pull requests should include a short summary, linked ticket or issue, verification commands run, and screenshots or recordings for UI changes. Call out config, environment, or API contract changes explicitly.
