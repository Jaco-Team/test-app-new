import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { transformWithOxc } from 'vite';

const root = fileURLToPath(new URL('../../', import.meta.url));

export default defineConfig({
  root,
  plugins: [{
    name: 'catalog-route-jsx',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('/pages/[city]/menu/[category].js') || id.endsWith('/components/meta.js')) {
        return transformWithOxc(code, id, { lang: 'jsx', jsx: { runtime: 'automatic' } });
      }
    },
  }],
  resolve: { alias: { '@': root } },
  test: {
    environment: 'node',
    include: ['tests/seo/*.test.js'],
  },
});
