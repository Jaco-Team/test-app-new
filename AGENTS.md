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

## Local Notes

- Do not run format, lint, prettier, or eslint commands unless explicitly requested.
- Keep generated local Codex files under `.codex/`; this directory is ignored by git.
