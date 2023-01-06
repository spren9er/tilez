import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
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
      $fixtures: './src/fixtures',
    },
  },
};

export default config;
