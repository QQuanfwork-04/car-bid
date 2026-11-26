import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 120000,
    env: {
      NODE_ENV: 'test',
      JWT_SECRET: 'test-secret-that-is-definitely-longer-than-32-chars',
      ENABLE_DOCS: 'true',
    },
  },
});
