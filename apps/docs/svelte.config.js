import adapter from '@sveltejs/adapter-node';
import { mdsvex } from 'mdsvex';

import sequence from 'svelte-sequential-preprocessor';
import preprocess from 'svelte-preprocess';
import { preprocessThrelte } from '@threlte/preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    sequence([preprocess({ postcss: true }), preprocessThrelte()]),
    mdsvex({
      extensions: ['.md', '.svx']
      // layout: 'src/routes/stories/layout.svelte'
    })
  ],

  ssr: {
    noExternal: ['three', 'troika-three-text']
  },

  extensions: ['.svelte', '.md', '.svx'],

  kit: {
    adapter: adapter()
  }
};

export default config;
