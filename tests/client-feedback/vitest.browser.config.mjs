import { defineConfig } from 'vitest/config';
import { transformWithOxc } from 'vite';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));

// Оценка заказа в модалке заказа: настоящий React в Chromium, сеть подменена.
export default defineConfig({
  root,
  plugins: [
    {
      name: 'client-feedback-jsx',
      enforce: 'pre',
      transform(code, id) {
        if (
          id.startsWith(root) &&
          !id.includes('/node_modules/') &&
          /\.(js|jsx)$/.test(id)
        ) {
          return transformWithOxc(code, id, {
            lang: 'jsx',
            jsx: { runtime: 'automatic' },
          });
        }
      },
    },
  ],
  resolve: { alias: { '@': root } },
  optimizeDeps: {
    noDiscovery: true,
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      '@testing-library/dom',
    ],
  },
  test: {
    attachmentsDir: '.codex/client-feedback-test-attachments',
    include: ['tests/client-feedback/*.browser.jsx'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        launchOptions: {
          channel: process.env.CLIENT_FEEDBACK_BROWSER_CHANNEL || undefined,
        },
      }),
      instances: [{ browser: 'chromium' }],
    },
  },
});
