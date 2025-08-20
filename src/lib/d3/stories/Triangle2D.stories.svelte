<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Triangle2D from '../Triangle2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/Triangle2D',
    component: Triangle2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas2D from '../Canvas2D.svelte';
  import { Vector2 } from 'three';
  import { type Triangle2DProps } from '../Triangle2D.svelte';
</script>

{#snippet template(args: Triangle2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <Triangle2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<!-- Triangle with default color -->
<Story
  name="Default"
  args={{ points: [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)] }}
  {template}
/>

<!-- Triangle with a changed color -->
<Story
  name="Color"
  args={{
    color: PrimeColor.raspberry,
    points: [new Vector2(-2, 0), new Vector2(1, -1), new Vector2(1, 1)]
  }}
  {template}
/>
