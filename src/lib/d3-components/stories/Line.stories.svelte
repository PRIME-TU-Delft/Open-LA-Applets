<script lang="ts" context="module">
  import type { Meta } from '@storybook/svelte';
  import Line from '../Line.svelte';

  export const meta = {
    title: '2d components/Line',
    component: Line,
    tags: ['autodocs']
  } satisfies Meta<Line>;
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Canvas from '../Canvas.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
</script>

<Template let:args>
  <Canvas height="20rem">
    <!-- See properties panel in the Line docs to see which args are allowed  -->
    <Line start={new Vector2(1, 1)} {...args} />
  </Canvas>
</Template>

<!-- Dynamic snippet should be disabled for this story -->
<Story name="With color" source args={{ color: PrimeColor.raspberry }} />

<Story name="With start" source args={{ start: new Vector2(1, 2) }} />
<Story name="With end" source args={{ end: new Vector2(2, 3) }} />
<Story name="With width defined" source args={{ width: 0.1 }} />
<Story name="With dashed" source args={{ isDashed: true }} />
