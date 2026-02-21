import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['list']
  ],

  use: {
    baseURL: 'http://localhost:5182',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Dev server już działa w tle
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:5182',
  //   reuseExistingServer: true,
  //   timeout: 120000,
  // },
});
