import { defineConfig } from 'vitest/config';
import { transformWithOxc } from 'vite';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
export default defineConfig({
  root,
  plugins: [{ name: 'sbp-jsx', enforce: 'pre', transform(code, id) {
    if (id.startsWith(root) && !id.includes('/node_modules/') && /\.(js|jsx)$/.test(id)) return transformWithOxc(code, id, { lang: 'jsx', jsx: { runtime: 'automatic' } });
  } }],
  resolve: { alias: { '@': root } },
  optimizeDeps: { noDiscovery: true, include: ['react', 'react-dom/client', 'react/jsx-runtime', '@testing-library/dom', '@mui/material/Alert', '@mui/material/Button', 'crypto-js/sha256', 'dayjs', 'dayjs/locale/ru', 'dayjs/plugin/isoWeek', 'zustand/traditional', 'zustand/shallow', 'zustand/middleware'] },
  test: {
    attachmentsDir: '.codex/sbp-return-test-attachments', include: ['tests/sbp/*.browser.jsx'],
    browser: { enabled: true, headless: true, provider: playwright({ launchOptions: { channel: process.env.SBP_BROWSER_CHANNEL || undefined } }), instances: [{ browser: 'chromium' }] },
  },
});
