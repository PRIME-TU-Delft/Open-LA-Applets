<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Latex2D, { type Latex2DProps } from '../Latex2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/Latex2D',
    component: Latex2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import type { Snippet } from 'svelte';
  import { Vector2 } from 'three';
  import Canvas2D from '../Canvas2D.svelte';
</script>

{#snippet template(args: Latex2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <Latex2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<!-- Dynamic snippet should be disabled for this story -->
<Story name="With color" args={{ latex: 'E=mc^2', color: PrimeColor.raspberry }} {template} />

<!-- A LaTeX text with different content defined -->
<Story name="With content defined" args={{ latex: 'a^2 + b^2 = c^2' }} {template} />

<Story name="With font size defined" args={{ latex: 'E=mc^2', fontSize: 4 }} {template} />

<Story
  name="With position defined"
  args={{ latex: 'E=mc^2', position: new Vector2(1, 1) }}
  {template}
/>

<Story
  name="With offset defined"
  args={{ latex: 'E=mc^2', offset: new Vector2(0.5, 0.5) }}
  {template}
/>

<Story name="With extend defined" args={{ latex: 'E=mc^2', extend: 2 }} {template} />
