import { expect, test } from '@playwright/test';

const stories = [
  {
    name: 'header',
    id: 'ui-виджеты-шапка--по-умолчанию',
  },
  {
    name: 'footer',
    id: 'ui-виджеты-подвал--по-умолчанию',
  },
  {
    name: 'home',
    id: 'страницы-главная--превью',
  },
] as const;

for (const story of stories) {
  test(`${story.name} matches snapshot`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    await page.waitForLoadState('domcontentloaded');
    const root = page.locator('#storybook-root');
    await expect(root).toBeVisible({ timeout: 20_000 });
    await expect(root).toHaveScreenshot(`${story.name}.png`, {
      maxDiffPixelRatio: 0.03,
    });
  });
}
