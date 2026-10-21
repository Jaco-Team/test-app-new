import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

const root = fileURLToPath(new URL('../../', import.meta.url));

export default defineConfig({
  root,
  optimizeDeps: {
    include: ['react', 'react-dom/client'],
  },
  test: {
    include: ['tests/product-images/*.browser.ts'],
    attachmentsDir: '.codex/product-image-test-attachments',
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({ launchOptions: { channel: 'chrome' } }),
      instances: [{ browser: 'chromium' }],
    },
  },
});
