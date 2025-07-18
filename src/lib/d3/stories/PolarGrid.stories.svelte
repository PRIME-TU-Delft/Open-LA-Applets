<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PolarGrid from '../PolarGrid.svelte';

  const { Story } = defineMeta({
    title: 'D3/PolarGrid',
    component: PolarGrid
  });
</script>

<script lang="ts">
  import Canvas2D from '../Canvas2D.svelte';
  import type { PolarGridProps } from '../PolarGrid.svelte';

  let canvasProps = { customAxis: true };
</script>

{#snippet template(args: PolarGridProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D {...canvasProps}>
      <PolarGrid {...args} />
    </Canvas2D>
  </div>
{/snippet}

<!-- Polar grid with default parameters. This story demonstrates a polar grid with a default angle step of 30 degrees. -->
<Story name="Default" args={{}} {template} />

<!-- Polar grid without ticks and radii numbers. This story demonstrates a polar grid without any ticks on the x-axis. -->
<Story name="Without radii ticks" args={{ showRadiiTicks: false }} {template} />

<!-- Polar grid with angle ticks enabled. This story demonstrates how to show the angle sizes next to the angled grid lines. The angle labels will be further away from the origin based on the number of angled lines (angleStep). -->
<Story name="With angle ticks" args={{ showAngleTicks: true }} {template} />

<!-- Polar grid with changed angleStep. This story demonstrates a polar grid with a custom angle step of 45 degrees, showcasing how you can customize the grid lines. -->
<Story name="With 45 degree step" args={{ angleStep: 45 }} {template} />

<!-- Polar grid with some highlighted radii. This story demonstrates a polar grid with some circles highlighted, showcasing how you can mark some distances as "special". -->
<Story name="With highlighted radii" args={{ highlightRadii: [1, 3, 4, 6] }} {template} />
