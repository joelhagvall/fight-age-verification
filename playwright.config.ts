import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'bun run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env['CI'],
    timeout: 30_000,
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'desktop-safari',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 15'] },
    },
  ],
})
