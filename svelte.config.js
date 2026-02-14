// Adapters
import nodeAdapter from '@sveltejs/adapter-node';
import netlifyAdapter from '@sveltejs/adapter-netlify';

/* eslint-disable no-console */
console.log('Building for: ' + process.env.BUILD_ENV === 'netlify' ? 'Netlify' : 'NodeJS');

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: process.env.BUILD_ENV === 'netlify' ? netlifyAdapter() : nodeAdapter(),
    alias: {
      '@/*': './path/to/lib/*'
    }
  }
};

export default config;
