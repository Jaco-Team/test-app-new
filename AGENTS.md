# Project Codex Instructions

## Scope

- Current redesign work is Storybook-first.
- Do not change the base Next.js application while transferring design and behavior into Storybook.
- Treat Storybook components as the future source for the app rewrite.

## Architecture Direction

- Use FSD + TypeScript for new Storybook work.
- Keep new stories and components inside `stories/{app,pages,widgets,features,entities,shared}`.
- Do not add new work to `stories/legacy`; migrate from it into FSD layers when needed.
- Follow dependency direction: `app -> pages -> widgets -> features -> entities -> shared`.

## Responsive Targets

- Mobile: `320px` through `667px`.
- Tablet: `668px` through `990px`.
- Desktop: `991px` and wider.
- Tablet is a required separate design variation, not a stretched mobile or desktop variant.

## Workflow

- First stage: move current design and behavior into Storybook.
- Second stage: rebuild the base app from Storybook components.
- Final stage: move backend behavior from the custom implementation to Laravel.

## Agent Roles

- A team of specialized agent roles is defined as Cursor rules in `.cursor/rules/`. Role charters are written in Russian.
- The orchestrator is always applied; the other roles are agent-requested (pulled in on demand). To act as a role, follow the matching file in `.cursor/rules/`.
- Roles:
  - `00-orchestrator.mdc` — Team Lead / Оркестратор: routing, pipelines, stage context, shared Definition of Done (always applied).
  - `10-analyst.mdc` — Аналитик: requirements, legacy inventory, acceptance criteria.
  - `11-solution-analyst.mdc` — Аналитик решений: technical design, FSD layer choice, decomposition, trade-offs.
  - `12-product-analyst.mdc` — Продукт-аналитик: priorities, user flows, metrics.
  - `20-developer.mdc` — Разработчик: FSD TypeScript components and Storybook stories.
  - `21-design-steward.mdc` — UX/UI дизайн-стюард: design tokens, Storybook tree, Figma.
  - `22-a11y-responsive.mdc` — Доступность и адаптив: breakpoints, separate tablet, a11y.
  - `23-devops-release.mdc` — DevOps / релиз: build, pm2, Chromatic, CI, Sentry.
  - `30-tester.mdc` — Тестировщик / QA: Storybook play + Vitest, smoke checks.
  - `31-code-reviewer.mdc` — Ревьюер кода: FSD boundaries, types, SCSS `@use`, story variants.
  - `32-critic.mdc` — Критик: holistic critique, risks, edge cases.
  - `40-marketer.mdc` — Маркетолог: promotions, SEO, campaigns.
  - `41-rewriter.mdc` — Рерайтер: RU copy editing, microcopy.
- Typical slice pipeline: Продукт-аналитик → Аналитик → Аналитик решений → Дизайн-стюард → Разработчик → Доступность/адаптив → Тестировщик → Ревьюер → Критик → DevOps.

## Language

- Chat with the user in English by default.
- Write documentation, code comments, UI labels, and Storybook titles in Russian unless the surrounding file clearly uses another language.

## Local Notes

- Do not run format, lint, prettier, or eslint commands unless explicitly requested.
- Keep generated local Codex files under `.codex/`; this directory is ignored by git.
