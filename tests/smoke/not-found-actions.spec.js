import { expect, test } from '@playwright/test';

test('404 navigation actions have equal widths', async ({ page }) => {
  await page.goto('/404');

  const backButton = page.getByRole('button', { name: '← Назад' });
  const homeLink = page.getByRole('link', { name: 'На главную' });

  await expect(backButton).toBeVisible();
  await expect(homeLink).toBeVisible();
  await expect
    .poll(async () => {
      const [back, home] = await Promise.all([
        backButton.boundingBox(),
        homeLink.boundingBox(),
      ]);

      return back && home ? Math.abs(back.width - home.width) : null;
    })
    .toBeLessThan(0.5);
  await expect
    .poll(async () => (await homeLink.boundingBox())?.height ?? Infinity)
    .toBeLessThan(44);
});
