import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  test: {
    globals: true,
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
};

export default config;
