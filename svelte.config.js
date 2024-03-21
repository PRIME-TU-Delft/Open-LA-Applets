// Adapters
import nodeAdapter from '@sveltejs/adapter-node';
import netlifyAdapter from '@sveltejs/adapter-netlify';

console.log('Building for: ' + process.env.BUILD_ENV === 'netlify' ? 'Netlify' : 'NodeJS');

import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
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
