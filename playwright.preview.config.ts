import { defineConfig, devices } from '@playwright/test';

const APP_URL = process.env.APP_URL ?? 'http://127.0.0.1:3000';

/** Opt-in parity captures: legacy vs preview at fixed pixel viewports. */
export default defineConfig({
  testDir: 'tests/preview-parity',
  snapshotPathTemplate:
    '{testDir}/__snapshots__/{testFilePath}/{projectName}-{arg}{ext}',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: APP_URL,
    trace: 'off',
  },
  webServer: {
    command: 'npm run dev',
    url: APP_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'compact',
      use: {
        ...devices['iPhone SE'],
        viewport: { width: 320, height: 720 },
      },
    },
    {
      name: 'regular',
      use: {
        ...devices['iPad Mini'],
        viewport: { width: 668, height: 900 },
      },
    },
    {
      name: 'expanded',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 991, height: 900 },
      },
    },
  ],
});
