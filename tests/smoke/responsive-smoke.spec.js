const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-991', width: 991, height: 900 },
];

const pages = [
  { name: 'home', path: '/togliatti' },
  { name: 'menu', path: '/togliatti/menu' },
  { name: 'cart', path: '/togliatti/cart' },
];

test.describe('Responsive smoke screenshots', () => {
  for (const viewport of viewports) {
    test(`captures pages at ${viewport.name}`, async ({ page }, testInfo) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      for (const pageTarget of pages) {
        await page.goto(pageTarget.path, { waitUntil: 'networkidle' });
        await expect(page).toHaveURL(new RegExp(pageTarget.path));
        await page.waitForTimeout(1000);

        const fileName = `${viewport.name}-${pageTarget.name}.png`;
        const screenshotPath = testInfo.outputPath(fileName);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        await testInfo.attach(fileName, { path: screenshotPath, contentType: 'image/png' });
      }
    });
  }
});
