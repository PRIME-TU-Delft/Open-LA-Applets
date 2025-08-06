<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Polygon2D from '../Polygon2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/Polygon2D',
    component: Polygon2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas2D from '../Canvas2D.svelte';
  import { Vector2 } from 'three';
  import { type Polygon2DProps } from '../Polygon2D.svelte';
</script>

{#snippet template(args: Polygon2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <Polygon2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<!-- Polygon with default parameters and some points defining a triangle -->
<Story
  name="Default"
  args={{ points: [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)] }}
  {template}
/>

<!-- Polygon with strokeColor, color and opacity parameters defined and some points defining a complex shape -->
<Story
  name="Color"
  args={{
    strokeColor: PrimeColor.black,
    color: PrimeColor.raspberry,
    opacity: 0.5,
    points: [
      new Vector2(-2, 0),
      new Vector2(1, 0),
      new Vector2(1, 1),
      new Vector2(2, 0),
      new Vector2(3, 4)
    ]
  }}
  {template}
/>

<!-- Transparent polygon with only the stroke, defining a triangle, offset by a vector -->
<Story
  name="Offset"
  args={{
    color: '#ffffff00',
    strokeColor: PrimeColor.raspberry,
    strokeWidth: 3,
    offset: new Vector2(-3, 1.5),
    points: [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)]
  }}
  {template}
/>
