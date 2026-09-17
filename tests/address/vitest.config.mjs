import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
export default defineConfig({
  root,
  resolve: { alias: { '@': root } },
  test: { environment: 'node', include: ['tests/address/*.test.js'] },
});
