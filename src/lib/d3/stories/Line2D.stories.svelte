<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Line2D from '../Line2D.svelte';

  const { Story } = defineMeta({
    title: '2D Components/Line2D',
    component: Line2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import Canvas2D from '../Canvas2D.svelte';
  import type { Line2DProps } from '../Line2D.svelte';
</script>

{#snippet template(args: Line2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <Line2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<!-- Dynamic snippet should be disabled for this story -->
<Story
  name="With color"
  args={{ start: new Vector2(0, 0), end: new Vector2(1, 1), color: PrimeColor.raspberry }}
  {template}
/>

<!-- A Line with different start and end points defined -->
<Story
  name="With start and end points defined"
  args={{ start: new Vector2(1, 1), end: new Vector2(-1, -1) }}
  {template}
/>

<Story
  name="With width defined"
  args={{ start: new Vector2(0, 0), end: new Vector2(1, 1), width: 0.1 }}
  {template}
/>

<Story
  name="With dashed line"
  args={{ start: new Vector2(0, 0), end: new Vector2(1, 1), isDashed: true }}
  {template}
/>
