import { defineConfig, devices } from '@playwright/test';

const STORYBOOK_URL = process.env.STORYBOOK_URL ?? 'http://127.0.0.1:6007';

export default defineConfig({
  testDir: 'tests/ui-visual',
  snapshotPathTemplate:
    '{testDir}/__snapshots__/{testFilePath}/{projectName}-{arg}{ext}',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: STORYBOOK_URL,
    trace: 'off',
  },
  webServer: {
    command: 'npm run storybook -- --no-open',
    url: STORYBOOK_URL,
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
