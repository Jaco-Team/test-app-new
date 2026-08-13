import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'mobile-320', width: 320, height: 720, columns: 1 },
  { name: 'mobile-375', width: 375, height: 812, columns: 1 },
  { name: 'tablet-668', width: 668, height: 900, columns: 2 },
  { name: 'tablet-768', width: 768, height: 1024, columns: 2 },
  { name: 'tablet-990', width: 990, height: 900, columns: 2 },
  { name: 'desktop-991', width: 991, height: 900, columns: 2 },
  { name: 'desktop-1440', width: 1440, height: 1000, columns: 2 },
];

test.describe('City selection responsive layout', () => {
  for (const viewport of viewports) {
    test(`renders the city selector at ${viewport.name}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      const heading = page.getByRole('heading', {
        level: 1,
      });
      const togliatti = page.getByRole('link', { name: /Тольятти/ });
      const samara = page.getByRole('link', { name: /Самара/ });

      await expect(heading).toBeVisible();
      await expect(togliatti).toBeVisible();
      await expect(samara).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth
        )
      ).toBe(true);

      const togliattiBox = await togliatti.boundingBox();
      const samaraBox = await samara.boundingBox();

      expect(togliattiBox).not.toBeNull();
      expect(samaraBox).not.toBeNull();

      if (viewport.columns === 1) {
        expect(samaraBox.y).toBeGreaterThan(togliattiBox.y + 20);
      } else {
        expect(Math.abs(samaraBox.y - togliattiBox.y)).toBeLessThan(4);
      }

      const screenshotPath = testInfo.outputPath(`${viewport.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      await testInfo.attach(`${viewport.name}.png`, {
        path: screenshotPath,
        contentType: 'image/png',
      });
    });
  }
});
