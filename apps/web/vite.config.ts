import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: ['three']
  },
  resolve: {
    alias: {
      "$routes": path.resolve(__dirname, './src/routes'),
    }
  }
});
