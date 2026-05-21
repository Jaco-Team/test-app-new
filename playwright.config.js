const { defineConfig, devices } = require('@playwright/test');

const isCI = Boolean(process.env.CI);

module.exports = defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries: isCI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx next dev -H localhost -p 3000',
    url: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
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
