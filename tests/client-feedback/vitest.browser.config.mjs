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
      'react/jsx-dev-runtime',
      '@testing-library/dom',
      '@mui/icons-material/CheckCircleOutline',
      '@mui/icons-material/Close',
      '@mui/material/Alert',
      '@mui/material/Box',
      '@mui/material/Button',
      '@mui/material/Checkbox',
      '@mui/material/Chip',
      '@mui/material/CircularProgress',
      '@mui/material/Dialog',
      '@mui/material/DialogActions',
      '@mui/material/DialogContent',
      '@mui/material/DialogTitle',
      '@mui/material/FormControl',
      '@mui/material/FormControlLabel',
      '@mui/material/FormGroup',
      '@mui/material/FormHelperText',
      '@mui/material/FormLabel',
      '@mui/material/IconButton',
      '@mui/material/Rating',
      '@mui/material/Stack',
      '@mui/material/SwipeableDrawer',
      '@mui/material/TextField',
      '@mui/material/Typography',
      '@mui/material/useMediaQuery',
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
