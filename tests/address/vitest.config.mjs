import { defineConfig } from 'vitest/config';
import { transformWithOxc } from 'vite';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
export default defineConfig({
  root,
  plugins: [
    {
      name: 'address-modal-jsx',
      enforce: 'pre',
      transform(code, id) {
        if (
          /modules\/profile\/(address\/modalAddressMobile\.js|profile\/modalAddr\.jsx)$/.test(
            id
          )
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
  test: { environment: 'node', include: ['tests/address/*.test.js'] },
});
