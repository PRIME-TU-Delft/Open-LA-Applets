import type { Preview } from '@storybook/sveltekit';

import '../src/app.css';
import 'katex/dist/katex.min.css';

import { addMessages, init } from 'svelte-i18n';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Colors',
          'Localization',
          'Tutorials',
          'Initialize',
          '2D Components',
          '3D Components',
          '*'
        ]
      }
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  tags: ['autodocs']
};

// Localization
import enUI from '../src/lang/en/ui.json';
import enApplets from '../src/lang/en/applets.json';

import nlUI from '../src/lang/nl/ui.json';
import nlApplets from '../src/lang/nl/applets.json';

addMessages('en', enUI);
addMessages('en', { applets: enApplets });
addMessages('nl', nlUI);
addMessages('nl', { applets: nlApplets });

init({
  fallbackLocale: 'en'
});

export default preview;
