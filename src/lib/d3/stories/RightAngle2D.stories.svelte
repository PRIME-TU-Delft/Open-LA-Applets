<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RightAngle2D from '../RightAngle2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/RightAngle2D',
    component: RightAngle2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas2D from '../Canvas2D.svelte';
  import type { RightAngle2DProps } from '../RightAngle2D.svelte';
  import { Vector2 } from 'three';
</script>

{#snippet template(args: RightAngle2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <RightAngle2D {...args} vs={[new Vector2(1, 0), new Vector2(0, 1)]} />
    </Canvas2D>
  </div>
{/snippet}

<Story name="Default" {template} />

<!-- With custom color defined -->
<Story name="Custom color" args={{ color: PrimeColor.raspberry }} {template} />

<!-- With custom size defined -->
<Story name="Custom size" args={{ size: 0.5 }} {template} />

<!-- With custom stroke width defined -->
<Story name="Custom stroke width" args={{ lineWidth: 0.05 }} {template} />
