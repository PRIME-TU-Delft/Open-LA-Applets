<script lang="ts" context="module">
  import type { Meta } from '@storybook/svelte';
  import Parallelogram from '../Parallelogram.svelte';

  export const meta = {
    title: '2d components/Parallelgram',
    component: Parallelogram,
    tags: ['autodocs'],
    parameters: docsForStory(
      'This parallelogram component has a single required variable which is `points`. All other variables are optional.'
    )
  } satisfies Meta<Parallelogram>;
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
    <!-- See properties panel in the Parallelogram docs to see which args are allowed  -->
    <Parallelogram points={[new Vector2(0, 0), new Vector2(1, 1), new Vector2(1, 3)]} {...args} />
  </Canvas>
</Template>

<Story name="Default" source />

<!-- Dynamic snippet should be disabled for this story -->
<Story name="With color" source args={{ color: PrimeColor.raspberry }} />

<Story name="With strokeWidth" source args={{ color: PrimeColor.raspberry, strokeWidth: 2 }} />
