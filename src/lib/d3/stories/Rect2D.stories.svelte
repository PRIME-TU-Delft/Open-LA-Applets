<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Rect2D from '../Rect2D.svelte';

  const { Story } = defineMeta({
    title: '2D Components/Rect2D',
    component: Rect2D
  });
</script>

<script lang="ts">
  import { Vector2 } from 'three';
  import Canvas2D from '../Canvas2D.svelte';
  import type { Rectangle2DProps } from '../Rect2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
</script>

{#snippet template(args: Rectangle2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <Rect2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<Story
  name="Default rectangle (points (0,0) to (2,1))"
  args={{ points: [new Vector2(0, 0), new Vector2(2, 1)] }}
  {template}
/>

<!-- A rectangle with a custom color -->
<Story
  name="With custom color"
  args={{ points: [new Vector2(0, 0), new Vector2(2, 1)], color: PrimeColor.cyan }}
  {template}
/>
