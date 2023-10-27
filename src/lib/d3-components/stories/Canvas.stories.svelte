<script lang="ts" context="module">
  import type { Meta } from '@storybook/svelte';
  import Canvas from '../Canvas.svelte';

  export const meta = {
    title: '2d components/Canvas',
    component: Canvas,
    tags: ['autodocs'],
    argTypes: {
      title: { type: 'string' },
      background: { type: 'string' }
    },
    parameters: {
      componentSubtitle: "The start of each 2d component",
      docs: {
        description: {
          component: 'Canvas is a component that allows you to draw 2d components on a canvas'
        }
      }
    }
  } satisfies Meta<Canvas>;
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <Canvas height="20rem" {...args} />
</Template>

<!-- Dynamic snippet should be disabled for this story -->
<Story name="Default" source parameters={{ docs: { description: {story: "your story-specific description here"} } }}>
  <Canvas height="20rem" />
</Story>

<!-- Dynamic snippet should be disabled for this story -->
<Story name="With title" source args={{ title: 'Hello this is a title' }} />

<Story name="With background" source args={{ background: 'red' }} />
