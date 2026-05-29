# Project Codex Instructions

## Scope

- **Legacy core** (`pages/`, `modules/`, `components/`, `styles/`) stays the production runtime at routes like `/samara`. Do not refactor it unless a task explicitly targets legacy behavior.
- **New core** lives under `src/` (FSD layers) + `app/preview` (App Router shell at repo root; Next requires `app/` and `pages/` as siblings).
- **Design system source of truth** is `src/shared/ui/**` with colocated `*.stories.tsx`. Storybook is executable specs and visual testing, not the DS source.
- **`stories/`** (including `stories/legacy`) is a frozen reference from the failed Storybook-first attempt. Do not add new DS work there.

## Architecture Direction

- Use FSD + TypeScript for all new work under `src/`.
- Layers: `app/` (Next routing shell) → `src/pages` (FSD compositions) → `src/widgets` → `src/features` → `src/entities` → `src/shared`.
- Design system code lives only in `src/shared/ui/{foundation,primitives,components,patterns,widgets}`.
- Follow dependency direction: `app -> pages -> widgets -> features -> entities -> shared`.
- Path aliases: `@ui/*` → `src/shared/ui/*`, `@src/*` → `src/*`, `@/*` → repo root (legacy).

## Responsive Targets

- Mobile (compact): `320px` through `667px`.
- Tablet (regular): `668px` through `990px`.
- Desktop (expanded): `991px` and wider.
- Tablet is a required separate design variation, not a stretched mobile or desktop variant.
- Prefer adaptive props and CSS over separate mobile/tablet/desktop components unless behavior genuinely differs.

## Visual parity and adaptivity

- Design/UX target: **100% match** with legacy (`/samara`) and https://jacofood.ru/samara; old code/styles are reference only.
- Layout uses fluid SCSS (`ui-fluid-compact/regular/expanded` in `src/shared/ui/foundation/_formulas.scss`). Formula args are **not** literal px on screen.
- **Pixel-first workflow:** capture and measure at fixed viewports (320, 668, 991 px) via Chrome/browser MCP or Playwright, then derive formula values and `ui-*` media wrappers. See [docs/tablet-adaptation-guide.md](docs/tablet-adaptation-guide.md).
- Cursor: rule `.cursor/rules/preview-ds.mdc`; skills `.cursor/skills/markup-parity`, `.cursor/skills/visual-capture`.
- Playwright: `npm run test:ui-visual` (Storybook); `npx playwright test -c playwright.preview.config.ts` (preview vs legacy, opt-in).

## Workflow

1. Build and refine UI in `src/shared/ui` (stories colocated).
2. Compose pages in `src/pages` and wire preview routes in `app/preview`.
3. Compare preview (`/preview/samara`) against legacy (`/samara`) and https://jacofood.ru/samara.
4. Preview may temporarily wire `components/store.js` and legacy header modals (TODO-NEW Step 5b) while DS chrome catches up visually.
5. Cut over individual routes when visual and behavioral parity is verified.
6. Final stage: migrate backend from the custom implementation to Laravel.

## Local Development

- `npm run dev` — legacy + preview cores on port 3000.
- Legacy home: `http://localhost:3000/samara`
- New core preview: `http://localhost:3000/preview/samara`
- `npm run storybook` — DS specs on port 6007.

## Language

- Chat with the user in English by default.
- Write documentation, code comments, UI labels, and Storybook titles in Russian unless the surrounding file clearly uses another language.

## Local Notes

- Do not run format, lint, prettier, or eslint commands unless explicitly requested.
- Keep generated local Codex files under `.codex/`; this directory is ignored by git.
- Master plan: `TODO-NEW.md`.
