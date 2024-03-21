<script lang="ts" context="module">
  import type { Meta } from '@storybook/svelte';
  import Point from '../Point.svelte';

  export const meta = {
    title: '2d components/Point',
    component: Point,
    tags: ['autodocs'],
    parameters: docsForStory(
      'This point component has a single required variable which is `position`. All other variables are optional. The default is thus set to THREE.Vector2(1,1)'
    )
  } satisfies Meta<Point>;
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Canvas from '../Canvas.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import docsForStory from '$lib/utils/docsForStory';
</script>

<Template let:args>
  <Canvas height="20rem">
    <!-- See properties panel in the Point docs to see which args are allowed  -->
    <Point position={new Vector2(1, 1)} {...args} />
  </Canvas>
</Template>

<!-- Dynamic snippet should be disabled for this story -->
<Story name="With color" source args={{ color: PrimeColor.raspberry }} />

<Story name="With position defined" source args={{ position: new Vector2(2, 0) }} />
<Story name="With radius" source args={{ radius: 0.25 }} />
<Story name="IsSquare" source args={{ isSquare: true }} />

<Story
  name="With pulse"
  source
  let:args
  parameters={docsForStory(
    'Using the pulse option indecates to the user that this point is interactive. For this instance we have not enabled interactivity. This can be done by adding a draggable instance.'
  )}
>
  <Canvas height="20rem" {...args}>
    <Point position={new Vector2(1, 1)} pulse {...args} />
    <Point position={new Vector2(1, 2)} isSquare pulse {...args} />
  </Canvas>
</Story>

<Story name="With opacity" source let:args>
  <Canvas height="20rem" {...args}>
    <Point position={new Vector2(1, 1)} opacity={0.5} {...args} />
    <Point position={new Vector2(1, 2)} isSquare opacity={0.5} {...args} />
  </Canvas>
</Story>
