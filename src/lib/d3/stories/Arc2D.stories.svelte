<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Arc2D from '../Arc2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/Arc2D',
    component: Arc2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { Arc2DProps } from '../Arc2D.svelte';
  import Canvas2D from '../Canvas2D.svelte';
</script>

{#snippet template(args: Arc2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <Arc2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<!-- Dynamic snippet should be disabled for this story -->
<Story
  name="With color"
  args={{ points: [new Vector2(1, 0), new Vector2(0, 1)], color: PrimeColor.raspberry }}
  {template}
/>

<!-- An Arc with different point defined -->
<Story
  name="With points defined"
  args={{ points: [new Vector2(1, 1), new Vector2(-1, -1)] }}
  {template}
/>

<Story
  name="With origin defined"
  args={{ points: [new Vector2(1, 0), new Vector2(0, 1)], origin: new Vector2(1, 1) }}
  {template}
/>

<Story
  name="With width defined"
  args={{ points: [new Vector2(1, 0), new Vector2(0, 1)], width: 0.1 }}
  {template}
/>

<!-- Default is 1 but can changed with the `distance` param -->
<Story
  name="With distance defined"
  args={{ points: [new Vector2(1, 0), new Vector2(0, 1)], distance: 2 }}
  {template}
/>

<Story
  name="With arrow"
  args={{ hasHead: true, points: [new Vector2(1, 1), new Vector2(-1, -1)] }}
  {template}
/>

<Story
  name="With arrow reversed"
  args={{ hasHead: true, points: [new Vector2(-1, -1), new Vector2(1, 1)] }}
  {template}
/>
