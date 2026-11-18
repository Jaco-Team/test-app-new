import { defineConfig } from 'vitest/config';
import { transformWithOxc } from 'vite';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));

export default defineConfig({
  root,
  define: { 'process.env.NEXT_PUBLIC_RECOMMENDATIONS_ENABLED': '"true"' },
  plugins: [{
    name: 'recommendation-jsx',
    enforce: 'pre',
    transform(code, id) {
      if (id.startsWith(root) && !id.includes('/node_modules/') && /\.(jsx|js)$/.test(id)) {
        return transformWithOxc(code, id, { lang: 'jsx', jsx: { runtime: 'automatic' } });
      }
    },
  }],
  resolve: { alias: { '@': root } },
  optimizeDeps: {
    noDiscovery: true,
    include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', '@testing-library/dom'],
  },
  test: {
    include: ['tests/recommendations/*.browser.jsx'],
    attachmentsDir: '.codex/recommendations-test-attachments',
    browser: {
      enabled: true,
      headless: true,
      screenshotDirectory: '.codex/recommendations-test-screenshots',
      provider: playwright({ launchOptions: { channel: 'chrome' }, contextOptions: { hasTouch: true } }),
      instances: [{ browser: 'chromium' }],
      commands: {
        async clickRecommendationToast({ page, frame }) {
          const testFrame = await frame();
          const bounds = await testFrame.locator('.RecommendationAddedToast').boundingBox();
          if (!bounds) throw new Error('Уведомление не видно');
          await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        },
        async dragRecommendation({ page, frame }) {
          const testFrame = await frame();
          const list = testFrame.locator('[data-recommendation-test] .RecommendationModalCardMobileList');
          const bounds = await list.boundingBox();
          if (!bounds) throw new Error('Лента рекомендаций не видна');
          const x = bounds.x + Math.min(200, bounds.width - 30);
          const y = bounds.y + 60;
          await page.mouse.move(x, y);
          await page.mouse.down();
          await page.mouse.move(x - 115, y + 1, { steps: 10 });
          await page.mouse.up();
          return list.evaluate(node => node.scrollLeft);
        },
        async swipeRecommendation({ page, context, frame }) {
          const testFrame = await frame();
          const list = testFrame.locator('[data-recommendation-test] .RecommendationModalCardMobileList');
          const bounds = await list.boundingBox();
          if (!bounds) throw new Error('Лента рекомендаций не видна');
          const cdp = await context.newCDPSession(page);
          const x = bounds.x + Math.min(240, bounds.width - 25);
          const y = bounds.y + 65;
          try {
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
            for (let step = 1; step <= 10; step++) {
              await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - step * 14, y: y + 1 }] });
            }
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
          } finally {
            await cdp.detach();
          }
          return list.evaluate(node => node.scrollLeft);
        },
      },
    },
  },
});
