<script lang="ts" context="module">
  import type { Meta } from '@storybook/svelte';
  import Canvas from '../Canvas.svelte';
  import docsForStory from '$lib/utils/docsForStory';

  export const meta = {
    title: '2d components/Canvas',
    component: Canvas,
    tags: ['autodocs'],
    argTypes: {
      title: { type: 'string' },
      background: { type: 'string' }
    },
    parameters: docsForStory(
      'Canvas is a component that allows you to draw 2d components on a canvas.',
      'The start of each 2d component'
    )
  } satisfies Meta<Canvas>;
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Vector from '../Vector.svelte';
  import { Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
</script>

<Template let:args>
  <!-- To see the details of `{...args}` in action, look at the canvas docs properties panel. -->
  <Canvas height="20rem" {...args} />
</Template>

<Story name="Default" source />

<!-- Dynamic snippet should be disabled for this story -->
<Story name="With title" source args={{ title: 'Hello this is a title' }} />

<Story name="With background" source args={{ background: PrimeColor.yellow }} />

<Story
  name="Split canvas"
  source
  parameters={docsForStory(
    'Adding a split canvas is trivial, add a `svelte:fragment` with a slot to splitCanvas and populate the second canvas like normal (this can even be a canvas3D). See code for more details.'
  )}
  let:args
  parameters={docsForStory(
    'Adding a split canvas is trivial, add a `svelte:fragment` with a slot to splitCanvas and populate the second canvas like normal (this can even be a canvas3D). See code for more details.'
  )}
  let:args
>
  <Canvas height="20rem" {...args}>
  <Canvas height="20rem" {...args}>
    <Vector direction={new Vector2(1, 2)} length={3} color={PrimeColor.red} />

    <svelte:fragment slot="splitCanvas">
      <Vector direction={new Vector2(1, 2)} length={3} color={PrimeColor.red} />
      <Vector direction={new Vector2(1, -1)} length={3} color={PrimeColor.ultramarine} />
    </svelte:fragment>
  </Canvas>
</Story>

<Story
  name="Zoom out"
  source
  args={{ zoom: 0.5 }}
  parameters={docsForStory('This canvas is zoomed out 2x by specifying zoom=0.5')}
/>
<Story
  name="Zoom in"
  source
  args={{ zoom: 2.0 }}
  parameters={docsForStory('This canvas is zoomed in 2x by specifying zoom=2')}
/>
