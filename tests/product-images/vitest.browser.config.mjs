import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

const root = fileURLToPath(new URL('../../', import.meta.url));
const imageRoutes = /^(https:\/\/(?:(?:mainimg|topimg)\.jacofood\.ru|storage\.yandexcloud\.net)\/|https?:\/\/[^/]+\/(?:_next\/image\?|jaco-logo\.png))/;
const imageRequests = new WeakMap();
// Изображение 32 × 32 сохраняет ненулевую naturalWidth и при масштабировании srcset.
const sampleImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAAAAABWESUoAAAAEklEQVR4nGNgGAWjYBSMAuwAAAQgAAGGsz1EAAAAAElFTkSuQmCC', 'base64');

export default defineConfig({
  root,
  resolve: { alias: { '@': root } },
  optimizeDeps: {
    include: ['react', 'react-dom/client'],
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
            const cdn = url.hostname === 'mainimg.jacofood.ru' || url.hostname === 'topimg.jacofood.ru';
            requests.push(url.href);
            // Незавершённый запрос останется под контролем Playwright до окончания теста.
            if (cdn && url.pathname.includes('/slow-')) return;
            if (url.pathname.includes('/missing-') || (cdn && url.pathname.includes('/offline-'))) {
              return route.abort('failed');
            }
            return route.fulfill({ contentType: 'image/png', body: sampleImage });
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
