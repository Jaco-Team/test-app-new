import { expect, test } from '@playwright/test';

const SITE_ORIGIN = 'https://jacofood.ru';

test.describe('SEO routing and canonical URLs', () => {
  test('serves the city selector at the root without an automatic redirect', async ({
    page,
  }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });

    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/\/$/);
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveTitle(/Жако/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Жако/
    );
    await expect(
      page.getByTestId('city-selection-description')
    ).not.toBeEmpty();
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${SITE_ORIGIN}/`
    );
    await expect(page.getByRole('link', { name: /Тольятти/ })).toHaveAttribute(
      'href',
      '/togliatti'
    );
    await expect(page.getByRole('link', { name: /Самара/ })).toHaveAttribute(
      'href',
      '/samara'
    );
  });

  test('opens a city with the keyboard', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const togliattiLink = page.getByRole('link', { name: /Тольятти/ });
    await togliattiLink.focus();
    await expect(togliattiLink).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/togliatti$/);
  });

  for (const target of [
    { path: '/togliatti', canonical: '/togliatti' },
    { path: '/samara', canonical: '/samara' },
    { path: '/togliatti/menu', canonical: '/togliatti/menu' },
    {
      path: '/togliatti/menu/rolly',
      canonical: '/togliatti/menu/rolly',
    },
  ]) {
    test(`renders a self-canonical for ${target.path}`, async ({ page }) => {
      const response = await page.goto(target.path, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL(new RegExp(`${target.path}$`));
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `${SITE_ORIGIN}${target.canonical}`
      );
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    });
  }

  test('does not render a canonical on an implicit noindex page', async ({
    page,
  }) => {
    const response = await page.goto('/togliatti/profile', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/i
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });
});
