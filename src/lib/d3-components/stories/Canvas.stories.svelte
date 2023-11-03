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
      'Canvas is a component that allows you to draw 2d components on a canvas',
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
  <Canvas height="20rem" {...args} />
</Template>

<!-- Dynamic snippet should be disabled for this story -->
<Story name="Default" source parameters={docsForStory('your story-specific description here')}>
  <Canvas height="20rem" />
</Story>

<!-- Dynamic snippet should be disabled for this story -->
<Story name="With title" source args={{ title: 'Hello this is a title' }} />

<Story name="With background" source args={{ background: PrimeColor.yellow }} />

<Story
  name="Split canvas"
  source
  parameters={docsForStory(
    'Adding a split canvas is trivial, add a `svelte:fragment` with a slot to splitCanvas and populate the second canvas like normal (this can even be a canvas3D). See code for more details.'
  )}
>
  <Canvas height="20rem">
    <Vector direction={new Vector2(1, 2)} length={3} color={PrimeColor.red} />

    <svelte:fragment slot="splitCanvas">
      <Vector direction={new Vector2(1, 2)} length={3} color={PrimeColor.red} />
      <Vector direction={new Vector2(1, -1)} length={3} color={PrimeColor.ultramarine} />
    </svelte:fragment>
  </Canvas>
</Story>
