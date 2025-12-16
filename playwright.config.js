import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'retain-on-failure',
    actionTimeout: 10000,
  },
  webServer: {
    command: 'npx http-server -p 8080 -s',
    port: 8080,
    timeout: 30000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
