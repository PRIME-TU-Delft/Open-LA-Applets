import adapter from '@sveltejs/adapter-node';
import sequence from 'svelte-sequential-preprocessor';
import preprocess from 'svelte-preprocess';
import { preprocessThrelte } from '@threlte/preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sequence([preprocess(), preprocessThrelte()]),

  ssr: {
    noExternal: ['three', 'troika-three-text']
  },

  kit: {
    adapter: adapter()
  }
};

export default config;
