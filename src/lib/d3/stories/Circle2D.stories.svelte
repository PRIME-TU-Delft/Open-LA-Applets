<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Circle2D from '../Circle2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/Circle2D',
    component: Circle2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import type { Circle2DProps } from '../Circle2D.svelte';
  import Canvas2D from '../Canvas2D.svelte';
  import { Vector2 } from 'three';
</script>

{#snippet template(args: Circle2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <Circle2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<!-- Circle with default parameters -->
<Story name="Default" {template} />

<!-- Dashed circle with color defined -->
<Story name="Dashed" args={{ color: PrimeColor.raspberry, isDashed: true }} {template} />

<!-- Circle with moved position and changed radius -->
<Story name="Moved" args={{ radius: 3, position: new Vector2(2, -1) }} {template} />

<!-- Circle filled with a set color (*fill*), with a specific border color (*color*) defined -->
<Story name="Filled" args={{ fill: PrimeColor.yellow, color: PrimeColor.darkGreen }} {template} />
