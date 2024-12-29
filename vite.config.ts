import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [
    // @ts-expect-error
    sveltekit({
      compilerOptions: {
        runes: true,
        css: 'injected',
      },
    }),
  ],
  test: {
    browser: {
      provider: 'webdriverio',
      enabled: true,
      name: 'chrome',
      headless: true,
      isolate: true,
      fileParallelism: true,
      screenshotFailures: false,
    },
    globals: true,
    include: ['tests/**/*.test.ts'],
    setupFiles: './tests/setup.ts',
    coverage: {
      include: ['src/lib/**/*.{ts,svelte}'],
      exclude: ['src/lib/index.ts', 'src/lib/types/**/*'],
      provider: 'istanbul',
    },
  },
  resolve: {
    alias: {
      $examples: './src/examples',
    },
  },
});
