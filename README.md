# test-app-new

Next.js app for [jacofood.ru](https://jacofood.ru) (legacy core) with a parallel FSD redesign under `src/`.

## Getting Started

```bash
npm run dev
npm run storybook
npm run test:ui-visual
```

Default local URLs:

| Surface                         | URL                                    |
| ------------------------------- | -------------------------------------- |
| Legacy core (production routes) | `http://localhost:3000/samara`         |
| New core preview                | `http://localhost:3000/preview/samara` |
| Storybook (DS specs)            | `http://localhost:6007`                |

## Architecture

Two runtimes share one dev server:

- **Legacy core** — `pages/`, `modules/`, `components/`, `styles/`. Unchanged routes (`/[city]`, cart, profile, etc.).
- **New core** — `app/preview/[city]` (App Router) composes `src/pages` using the design system in `src/shared/ui`.

```txt
app/                # Next App Router (thin preview routes)
src/
  pages/            # FSD page compositions
  widgets/          # page-level blocks (as needed)
  features/         # user actions (later)
  entities/         # domain types (later)
  shared/ui/        # design system (source of truth)
```

Do **not** rename `pages/` to `pages_old` — Next.js only recognizes a directory named `pages/`.

## Design System

- Source of truth: `src/shared/ui/**` with colocated `*.stories.tsx`
- Import alias: `@ui/*`
- Provider: `DesignSystemProvider` from `@ui/foundation`
- Breakpoints: compact `320–667`, regular `668–990`, expanded `991+`

Storybook documents components; it is not the DS source. The old `stories/` tree remains on disk as reference only.

## Redesign Direction

1. Extend `src/shared/ui` until widgets match production (reference: https://jacofood.ru/samara).
2. Compose pages in `src/pages` and validate on `/preview/[city]`.
3. Cut over routes from legacy `pages/` when parity is verified.
4. Later: Laravel backend migration.

## Development Notes

- Keep changes scoped and simple.
- Prefer existing project patterns before adding abstractions.
- TypeScript in `src/`; legacy JS remains allowed during migration.
- Do not run format/lint/prettier/eslint unless explicitly requested.

## Docs

| File                                                     | Purpose                       |
| -------------------------------------------------------- | ----------------------------- |
| [AGENTS.md](AGENTS.md)                                   | Codex / agent instructions    |
| [TODO-NEW.md](TODO-NEW.md)                               | Active DS + new core plan     |
| [STORYBOOK_REDESIGN_TODO.md](STORYBOOK_REDESIGN_TODO.md) | Archived Storybook-first plan |
| [stories/README_FSD.md](stories/README_FSD.md)           | Archived `stories/` FSD notes |

## Deploy

Standard Next.js build: `npm run build` && `npm start`. Preview routes are for development until cutover.
