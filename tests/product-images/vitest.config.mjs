import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = fileURLToPath(new URL('../../', import.meta.url));

export default defineConfig({
  root,
  resolve: {
    alias: {
      '@': root,
      '@stories': path.resolve(root, 'stories'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/product-images/*.test.ts'],
  },
});
