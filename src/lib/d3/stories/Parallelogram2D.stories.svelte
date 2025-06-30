<script module>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Parallelogram2D from '../Parallelogram2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/Parallelogram2D',
    component: Parallelogram2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import type { Snippet } from 'svelte';
  import { Vector2 } from 'three';
  import Canvas2D from '../Canvas2D.svelte';
  import type { Parallelogram2DProps } from '../Parallelogram2D.svelte';

  setTemplate(template as Snippet<[Partial<Parallelogram2DProps>]>);
</script>

{#snippet template(args: Parallelogram2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <Parallelogram2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<Story
  name="With color"
  args={{
    points: [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)],
    color: PrimeColor.raspberry
  }}
/>

<!-- A Parallelogram with different points defined -->
<Story
  name="With other points defined"
  args={{ points: [new Vector2(1, 1), new Vector2(3, 2), new Vector2(1, 2)] }}
/>

<Story
  name="With opacity defined"
  args={{ points: [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)], opacity: 0.5 }}
/>

<Story
  name="Without stroke width defined"
  args={{
    points: [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)],
    color: PrimeColor.raspberry,
    strokeWidth: 0
  }}
/>
