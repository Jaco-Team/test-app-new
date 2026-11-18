import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

const root = fileURLToPath(new URL('../../', import.meta.url));
const imageRoutes = /^(https:\/\/(mainimg|topimg)\.jacofood\.ru\/|https?:\/\/[^/]+\/(?:_next\/image\?|jaco-logo\.png))/;
const imageRequests = new WeakMap();
const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64');

export default defineConfig({
  root,
  resolve: { alias: { '@': root } },
  define: {
    'process.env.__NEXT_IMAGE_OPTS': 'undefined',
    'process.env.NEXT_DEPLOYMENT_ID': 'undefined',
    'process.env.NEXT_SUPPORTS_IMMUTABLE_ASSETS': 'false',
  },
  optimizeDeps: {
    include: ['react', 'react-dom/client', 'next/image'],
  },
  test: {
    include: ['tests/product-images/*.browser.{ts,jsx}'],
    attachmentsDir: '.codex/product-image-test-attachments',
    browser: {
      enabled: true,
      headless: true,
      screenshotDirectory: '.codex/product-image-test-screenshots',
      provider: playwright({ launchOptions: { channel: 'chrome' } }),
      instances: [{ browser: 'chromium' }],
      commands: {
        async interceptCatalogImages({ page }) {
          const requests = [];
          imageRequests.set(page, requests);
          await page.route(imageRoutes, (route) => {
            const url = new URL(route.request().url());
            const optimizer = url.pathname === '/_next/image';
            const path = optimizer ? new URL(url.searchParams.get('url')).pathname : url.pathname;
            requests.push(url.href);
            // Незавершённый запрос останется под контролем Playwright до окончания теста.
            if (!optimizer && path.includes('/slow-')) return;
            if (path.includes('/missing-') || (!optimizer && path.includes('/offline-'))) {
              return route.abort('failed');
            }
            return route.fulfill({ contentType: 'image/gif', body: pixel });
          });
        },
        catalogImageRequests({ page }) {
          return imageRequests.get(page);
        },
        async stopImageInterception({ page }) {
          await page.unroute(imageRoutes);
          imageRequests.delete(page);
        },
      },
    },
  },
});
