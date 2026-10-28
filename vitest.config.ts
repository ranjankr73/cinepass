import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',

    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/server.ts', 'src/**/*.d.ts', 'src/**/*.test.ts', 'src/**/*.spec.ts'],
    },
  },
});
