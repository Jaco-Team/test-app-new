# Project Codex Instructions

## Non-Negotiable Output Rule

- NEVER show code diffs in chat. This includes unified diffs, patch hunks, before/after snippets, generated patches, colored patch output, copied file bodies, and apply_patch contents or output.
- File edits must happen silently through tools. Chat may only contain short status updates and concise recaps.
- The only exception is when the user explicitly says `show diff`, `paste code`, or directly asks to see file contents.
- If a tool would expose patch contents in chat, avoid that tool for the edit when a non-diff file operation can safely do the job.

## Scope

- Current redesign work is Storybook-first.
- Do not change the base Next.js application while transferring design and behavior into Storybook.
- Treat Storybook components as the future source for the app rewrite.

## Architecture Direction

- Use FSD + TypeScript for new Storybook work.
- Keep new stories and components inside `stories/{app,pages,widgets,features,entities,shared}`.
- Do not add new work to `stories/legacy`; migrate from it into FSD layers when needed.
- Follow dependency direction: `app -> pages -> widgets -> features -> entities -> shared`.

## Storybook Style Framework

- Use `stories/pages/about/ui/AboutPage.scss` as the current page-level reference.
- Import shared Sass with `@use '<relative>/shared/global' as *;`.
- Keep tokens, functions, and mixins under `stories/shared/styles`, exported through `stories/shared/global.scss`.
- Use one kebab-case block per component/page and BEM-style elements/modifiers, for example `about-page`, `about-page__main`, `about-page--desktop`.
- Do not introduce new `PC` suffixes or legacy class hooks in FSD Storybook files. If `PC` is a viewport variant alongside Mobile and Tablet, name the FSD variant Desktop. Existing legacy names should stay in `stories/legacy` until migrated.
- Rewire TSX class names and SCSS selectors together. Do not leave compatibility duplicate selectors unless a consuming component still requires them.
- Keep SCSS beside its owning component; only shared primitives belong in `stories/shared/styles`.

## Responsive Targets

- Mobile: `320px` through `667px`.
- Tablet: `668px` through `990px`.
- Desktop: `991px` and wider.
- Tablet is a required separate design variation, not a stretched mobile or desktop variant.

## Workflow

- First stage: move current design and behavior into Storybook.
- Second stage: rebuild the base app from Storybook components.
- Final stage: move backend behavior from the custom implementation to Laravel.

## Language

- Chat with the user in English by default.
- Write documentation, code comments, UI labels, and Storybook titles in Russian unless the surrounding file clearly uses another language.

## Local Notes

- Do not run format, lint, prettier, or eslint commands unless explicitly requested.
- Keep generated local Codex files under `.codex/`; this directory is ignored by git.
