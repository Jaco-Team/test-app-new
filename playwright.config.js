import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);
const playwrightPort = process.env.PLAYWRIGHT_PORT || '3000';
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${playwrightPort}`;

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries: isCI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npx next dev -H 127.0.0.1 -p ${playwrightPort}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
});
