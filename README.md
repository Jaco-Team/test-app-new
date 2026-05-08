# test-app-new

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Base app:

```bash
npm run dev
```

Storybook:

```bash
npm run storybook
```

Default local URLs:

- App: `http://localhost:3000`
- Storybook: `http://localhost:6007`

## Redesign Direction

- First transfer current design and behavior into Storybook.
- Keep the base app unchanged during the Storybook transfer stage.
- Use FSD + TypeScript for new Storybook work.
- Later, rebuild the base app from Storybook components.
- Final stage: migrate backend behavior from the custom implementation to Laravel.

## Storybook Breakpoints

- Mobile: `320-667`
- Tablet: `668-990`
- Desktop: `991+`

Tablet is a separate required design variant.

## Storybook Structure

New Storybook work belongs in:

- `stories/app`
- `stories/pages`
- `stories/widgets`
- `stories/features`
- `stories/entities`
- `stories/shared`

Do not add new work to `stories/legacy`. Migrate legacy stories into FSD layers

## Development Notes

- Keep changes scoped and simple.
- Prefer existing project patterns before adding abstractions.
- Update README or task docs when workflow or project direction changes.
- For Storybook behavior changes, add or run relevant automatic Storybook checks when practical.
- Use Chrome MCP against the already-running local Storybook when visual or interaction verification is needed.
- TypeScript is configured with `tsconfig.json`; legacy JS remains allowed during migration.

## Existing Docs

- `AGENTS.md`: project instructions for Codex.
- `stories/README_FSD.md`: FSD Storybook structure.
- `STORYBOOK_REDESIGN_TODO.md`: staged redesign todo.

## Storybook Static

`storybook-static` is a generated static Storybook build. It can be used as a reference for previously built legacy stories, but source migration should happen from `stories/legacy` into typed FSD files under `stories/`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
