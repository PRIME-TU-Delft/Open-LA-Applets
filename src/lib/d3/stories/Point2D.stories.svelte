<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Point2D from '../Point2D.svelte';

  const { Story } = defineMeta({
    title: '2D Components/Point2D',
    component: Point2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import Canvas2D from '../Canvas2D.svelte';
  import type { Point2DProps } from '../Point2D.svelte';
</script>

{#snippet template(args: Point2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <Point2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<Story name="With color" args={{ color: PrimeColor.raspberry }} {template} />

<!-- A Point with different position defined -->
<Story name="With position defined" args={{ position: new Vector2(1, 1) }} {template} />

<!-- A Point with different radius defined -->
<Story name="With radius defined" args={{ radius: 2 }} {template} />

<!-- A Point with different shape defined -->
<Story name="With square shape" args={{ isSquare: true }} {template} />

<!-- A Point with pulse effect defined -->
<Story name="With pulse effect" args={{ pulse: true }} {template} />

<!-- A Point with opacity defined -->
<Story name="With opacity defined" args={{ opacity: 0.5 }} {template} />

<!-- A Point with text defined -->
<Story name="With text" args={{ text: 'Hello, World!' }} {template} />

<!-- A Point with text shown only on hover -->
<Story
  name="With text shown only on hover"
  args={{ text: 'Hover me!', showTextOnlyOnHover: true }}
  {template}
/>
