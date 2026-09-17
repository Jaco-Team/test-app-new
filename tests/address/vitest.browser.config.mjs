import { defineConfig } from 'vitest/config';
import { transformWithOxc } from 'vite';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
export default defineConfig({
  root,
  define: { 'process.env.NEXT_PUBLIC_YANDEX_TOKEN_MAP': '"test-map-key"' },
  plugins: [
    {
      name: 'address-jsx',
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
  optimizeDeps: {
    noDiscovery: true,
    include: [
      'react',
      'react-dom/client',
      'react/jsx-runtime',
      '@testing-library/dom',
      '@testing-library/user-event',
      '@mui/material/Dialog',
      '@mui/material/SwipeableDrawer',
      '@mui/material/DialogContent',
      '@mui/material/Backdrop',
      '@mui/material/Button',
      '@mui/material/IconButton',
      '@mui/material/useMediaQuery',
      '@mui/material/TextField',
      '@mui/material/Autocomplete',
      'react-imask',
      '@pbe/react-yandex-maps',
    ],
  },
  resolve: { alias: { '@': root } },
  test: {
    attachmentsDir: '.codex/address-test-attachments',
    include: ['tests/address/*.browser.jsx'],
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: {
          channel: process.env.ADDRESS_BROWSER_CHANNEL || undefined,
        },
      }),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
});
