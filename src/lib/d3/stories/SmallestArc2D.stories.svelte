<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SmallestArc2D from '../SmallestArc2D.svelte';
  import { Vector2 } from 'three';
  import Latex2D from '../Latex2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/SmallestArc2D',
    component: SmallestArc2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas2D from '../Canvas2D.svelte';
  import type { SmallestArc2DProps } from '../SmallestArc2D.svelte';
  import type { Snippet } from 'svelte';
</script>

{#snippet template(args: SmallestArc2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <SmallestArc2D {...args}>
        {#snippet label(position: Vector2)}
          <Latex2D latex={'\\varphi'} {position} extend={0.3} color={PrimeColor.black} />
        {/snippet}
      </SmallestArc2D>
    </Canvas2D>
  </div>
{/snippet}

<!-- Default -->
<Story
  name="Default"
  args={{
    points: [new Vector2(1, 0), new Vector2(0, 1)],
    distance: 1.5,
    color: PrimeColor.black,
    width: 0.02,
    hasHead: false
  }}
  {template}
/>

<!-- With different vectors -->
<Story
  name="With different vectors"
  args={{
    points: [new Vector2(1, 1), new Vector2(-1, 1)],
    distance: 1.5,
    color: PrimeColor.raspberry
  }}
  {template}
/>

<!-- With larger distance -->
<Story
  name="With larger distance"
  args={{
    points: [new Vector2(1, 0), new Vector2(0, 1)],
    distance: 2.5
  }}
  {template}
/>

<!-- With thicker line -->
<Story
  name="With thicker line"
  args={{
    points: [new Vector2(1, 0), new Vector2(0, 1)],
    distance: 1.5,
    color: PrimeColor.darkGreen,
    width: 0.05
  }}
  {template}
/>

<!-- With custom arrow defined -->
<Story
  name="With custom arrow defined"
  args={{
    points: [new Vector2(1, 0), new Vector2(0, 1)],
    distance: 1.5,
    color: PrimeColor.darkGreen,
    hasHead: true
  }}
  {template}
/>
