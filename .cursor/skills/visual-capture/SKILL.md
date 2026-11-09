---
name: visual-capture
description: Capture reference screenshots at fixed pixel viewports using Cursor IDE Browser MCP or Playwright. Use before markup parity work, for responsive audits, or when user asks for visual comparison at 320/668/991.
---

# Visual capture (pixel viewports)

## Viewport presets

| Name          | Width × height | Use              |
| ------------- | -------------- | ---------------- |
| compact-min   | 320 × 720      | Mobile minimum   |
| compact-mid   | 500 × 800      | Mobile mid-range |
| regular-min   | 668 × 900      | Tablet start     |
| regular-mid   | 800 × 900      | Tablet mid-range |
| expanded-min  | 991 × 900      | Desktop start    |
| expanded-wide | 1200 × 900     | Desktop wide     |

Always set **exact pixel width** before measuring or screenshotting — fluid vw layout depends on it.

## Cursor IDE Browser MCP

1. `browser_tabs` list — reuse tab if already on target URL.
2. `browser_navigate` to URL (`/samara`, `/preview/samara`, Storybook story, or production).
3. Resize viewport to target width (browser CDP or window size).
4. `browser_wait` / snapshot until network idle and fonts loaded.
5. `browser_take_screenshot` — save mentally or to `.codex/` for comparison (gitignored).

For modals: reproduce the same user actions on reference and preview before capture.

## Playwright

**Storybook** (existing):

```bash
npm run test:ui-visual
npm run test:ui-visual:update   # only when user asks to update baselines
```

**Preview vs legacy** (optional config):

```bash
npx playwright test -c playwright.preview.config.ts
```

## URLs

| Surface    | URL                                    |
| ---------- | -------------------------------------- |
| Legacy     | `http://localhost:3000/samara`         |
| Preview    | `http://localhost:3000/preview/samara` |
| Production | `https://jacofood.ru/samara`           |
| Storybook  | `http://localhost:6007`                |

## Rules

- Measure in **computed pixels**, not vw/%.
- Same viewport width for reference and target captures.
- Do not use Storybook-only captures as sole proof of preview parity — verify on `/preview/*` routes.
