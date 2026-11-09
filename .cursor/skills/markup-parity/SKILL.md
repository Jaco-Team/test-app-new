---
name: markup-parity
description: Align preview/DS markup with legacy and production using pixel measurements, vw formulas, and browser screenshots. Use for visual parity, layout fixes, responsive corrections, and Header/Footer/modal alignment tasks.
---

# Markup parity (preview vs legacy)

## When to use

- User asks to match legacy/production layout, fix responsive drift, or correct DS component spacing/typography.
- Task touches `src/shared/ui/**`, `src/pages/**`, or `app/preview/**`.

## Do not touch

`pages/`, `modules/`, `components/`, `styles/` unless the task explicitly says legacy.

## Steps

1. Read `docs/tablet-adaptation-guide.md` for formula denominators (870 / 668 / 1385).
2. Ensure `npm run dev` is running on port 3000.
3. Open **both** URLs at the same viewport width (px):
   - Reference: `http://localhost:3000/samara` or `https://jacofood.ru/samara`
   - Target: `http://localhost:3000/preview/samara`
4. Use **cursor-ide-browser** MCP:
   - `browser_navigate` → set viewport via resize/CDP if needed
   - `browser_take_screenshot` for before/after
   - `browser_snapshot` for structure; CDP `Runtime.evaluate` for `getComputedStyle` when needed
5. Repeat at **320**, **668**, **991** px minimum; add **500**, **800**, **1200** when layout is ambiguous.
6. Record mismatches as: element selector, property, reference px, preview px, viewport width.
7. Convert reference px to formula args (see guide); apply in component SCSS under `src/`.
8. Prefer `@include ui-fluid($prop, $expanded, $compact, $regular)` or range-specific `ui-fluid-*()` over raw px when legacy uses fluid scale.
9. Re-screenshot all three breakpoints before finishing.

## Playwright fallback

```bash
npx playwright test -c playwright.preview.config.ts
```

Use when batch snapshot comparison is needed; update snapshots only when user requests.

## Output format

Return a short table:

| Viewport | Area | Issue | Reference px | Fix (formula/token) |
| -------- | ---- | ----- | ------------ | ------------------- |

Then list files changed (expect only `src/` and `app/preview/`).
