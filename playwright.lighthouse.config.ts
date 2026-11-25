import { defineConfig, devices } from '@playwright/test';

export const LIGHTHOUSE_SCORE_THRESHOLDS = {
  performance: 80,
  accessibility: 90,
  'best-practices': 90,
  seo: 90,
} as const;

export const LIGHTHOUSE_SITE_URL = 'https://websparks-stg.sitefinity.cloud/home';

export default defineConfig({
  testDir: './tests/lighthouse',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 180_000,
  expect: { timeout: 15_000 },
  reporter: [['html', { outputFolder: 'playwright-report/lighthouse', open: 'never' }]],
  outputDir: 'test-results/lighthouse',
  projects: [
    {
      name: 'lighthouse-chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { args: ['--remote-debugging-port=9222'] },
      },
    },
  ],
});
