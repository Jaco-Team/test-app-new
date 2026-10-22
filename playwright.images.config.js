import { defineConfig } from '@playwright/test';

const externalBaseUrl = process.env.IMAGE_STORYBOOK_URL;
const baseURL = externalBaseUrl || 'http://127.0.0.1:6007';

export default defineConfig({
  testDir: './tests/product-images',
  testMatch: '**/*.spec.js',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report/images' }]],
  outputDir: 'test-results/product-images',
  use: {
    baseURL,
    browserName: 'chromium',
    channel: 'chrome',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command: 'npm run storybook -- --no-open',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
