import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    coverage: {
      include: ['**/*.ts'],
      exclude: ['**/*.d.ts', '**/node_modules/**'],
      reporter: ['lcov', 'text', 'text-summary'],
      thresholds: {
        branches: 10,
        functions: 40,
        lines: 25,
        statements: 30,
      },
    },
    environment: 'node',
    include: ['**/*.spec.ts'],
    testTimeout: 20000,
  },
});
