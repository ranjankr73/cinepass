import 'dotenv/config';
import { defineConfig } from '@playwright/test';

const configuredBaseURL = process.env.API_BASE_URL?.trim() || 'http://127.0.0.1:3000';

let baseURL: URL;

try {
  baseURL = new URL(configuredBaseURL);

  if (
    !['http:', 'https:'].includes(baseURL.protocol) ||
    baseURL.pathname !== '/' ||
    baseURL.search ||
    baseURL.hash
  ) {
    throw new Error('Expected an HTTP(S) origin without a path or query');
  }
} catch (error) {
  throw new Error(
    `Invalid API_BASE_URL "${configuredBaseURL}". ` +
      'Use an origin such as http://127.0.0.1:3000.',
    { cause: error },
  );
}

export default defineConfig({
  testDir: './tests/e2e',

  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,

  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: baseURL.origin,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
    trace: 'retain-on-failure',
  },

  webServer: {
    command: 'npm run dev',
    url: new URL('/health/live', baseURL).toString(),
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
