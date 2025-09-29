<script module>
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: '2D Components/Angle2D',
    component: Angle2D
  });
</script>

<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { Angle2DProps } from '$lib/d3/Angle2D.svelte';
</script>

{#snippet template(args: Angle2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <Angle2D startAngle={0} endAngle={Math.PI / 2} color={PrimeColor.black} {...args} />
    </Canvas2D>
  </div>
{/snippet}

<Story name="With color" args={{ color: PrimeColor.raspberry }} {template} />

<!-- Move origin -->
<Story name="With origin defined" args={{ origin: new Vector2(1, 1) }} {template} />

<!-- Change width -->
<Story name="With width defined" args={{ width: 0.1 }} {template} />

<!-- Change distance -->
<Story name="With distance defined" args={{ distance: 2 }} {template} />

<!-- Add arrow -->
<Story
  name="With arrow"
  args={{ hasHead: true, startAngle: 0, endAngle: Math.PI / 2 }}
  {template}
/>
