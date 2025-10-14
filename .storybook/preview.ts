import type { Preview } from '@storybook/sveltekit';

import '../src/app.css';
import 'katex/dist/katex.min.css';

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

export default preview;
