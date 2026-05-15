import { test, expect } from '@playwright/test';

test.describe('Storybook', () => {
  test('shell loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Storybook/i);
  });
});
