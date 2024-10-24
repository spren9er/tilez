import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  plugins: [sveltekit(), svelteTesting()],
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      include: ['src/lib/**/*.{ts,svelte}'],
    },
  },
  resolve: {
    alias: {
      $examples: './src/examples',
    },
  },
});
