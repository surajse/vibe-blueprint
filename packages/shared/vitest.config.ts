import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Never run compiled output: dist/ mirrors src after build.
    exclude: ['**/dist/**', '**/node_modules/**'],
  },
});
