import { expect, test } from '@playwright/test';

const routes = [
  { name: 'legacy-home', path: '/samara' },
  { name: 'preview-home', path: '/preview/samara' },
] as const;

for (const route of routes) {
  test(`${route.name} full-page snapshot`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot(`${route.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
}
