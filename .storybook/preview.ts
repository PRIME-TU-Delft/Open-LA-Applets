import type { Preview } from '@storybook/svelte';

import '../src/app.css';

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
        order: ['Initialize', 'D3', '*']
      }
    }
  },
  tags: ['autodocs']
};

export default preview;
