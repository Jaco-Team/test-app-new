import { defineConfig, devices } from '@playwright/test';

const storybookUrl = process.env.STORYBOOK_URL ?? 'http://127.0.0.1:6007';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  use: {
    baseURL: storybookUrl,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.PW_NO_WEB_SERVER
    ? undefined
    : {
        command: 'npm run storybook',
        url: storybookUrl,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
