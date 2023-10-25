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
    }
  } satisfies Meta<Canvas>;
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <!--👇 'on:click' allows to forward event to addon-actions  -->
  <Canvas {...args} />
</Template>

<!-- Dynamic snippet should be disabled for this story -->
<Story name="Default" source>
  <Canvas />
</Story>

<!-- Dynamic snippet should be disabled for this story -->
<Story name="With title" source args={{ title: 'Hello this is a title' }} />

<Story name="With background" source args={{ background: 'red' }} />
