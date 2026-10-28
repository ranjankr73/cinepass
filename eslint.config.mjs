import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'generated/prisma/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.strict,
  prettier,

  {
    rules: {
      // Add any project-specific rules here
    },
  },
);
