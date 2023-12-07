<script lang="ts" context="module">
  import docsForStory from '$lib/utils/docsForStory';
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
    parameters: docsForStory(
      'Canvas is a component that allows you to draw 2d components on a canvas.',
      'The start of each 2d component'
    )
  } satisfies Meta<Canvas>;
</script>

<script>
  import { Axis3D, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import { Vector2, Vector3 } from 'three';
  import Vector from '../Vector.svelte';
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
    'Adding a split canvas is trivial, add a `svelte:fragment` with a slot to splitCanvas and populate the second canvas like normal. See code for more details.'
  )}
  let:args
>
  <Canvas height="20rem" {...args}>
    <Vector direction={new Vector2(1, 2)} length={3} color={PrimeColor.red} />

    <svelte:fragment slot="splitCanvas">
      <Vector direction={new Vector2(1, 2)} length={3} color={PrimeColor.red} />
      <Vector direction={new Vector2(1, -1)} length={3} color={PrimeColor.ultramarine} />
    </svelte:fragment>
  </Canvas>
</Story>

<Story
  name="Split canvas 3d"
  source
  parameters={docsForStory(
    'Splitting is also possible with 2D and 3D combinations, add a `svelte:fragment` with a slot to splitCanvas3d and populate the second canvas like normal (this can even be a canvas3D). See code for more details.'
  )}
  let:args
>
  <Canvas height="20rem" cameraPosition={new Vector3(5.52, -5.35, 15.52)} {...args}>
    <Vector direction={new Vector2(5, 2)} length={3} color={PrimeColor.red} />
    <Vector direction={new Vector2(-5, 1)} length={3} color={PrimeColor.ultramarine} />

    <svelte:fragment slot="splitCanvas3d">
      <Vector3D direction={new Vector3(5, 2, 1)} length={3} color={PrimeColor.red} />
      <Vector3D direction={new Vector3(-5, 1, 1)} length={3} color={PrimeColor.ultramarine} />
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
