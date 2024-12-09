import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import contentCollections from '@content-collections/remix-vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
  },

  plugins: [
    !(process.env.VITEST || process.env.STORYBOOK) &&
      remix({
        future: {
          v3_singleFetch: true,
        },
      }),
    tsconfigPaths(),
    !process.env.STORYBOOK && contentCollections(),
    !!process.env.STORYBOOK && react(),
  ],

  worker: {
    plugins: () => [react()],
    format: 'es',
  },
});
