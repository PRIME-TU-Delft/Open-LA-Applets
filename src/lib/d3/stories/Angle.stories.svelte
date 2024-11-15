<script module>
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'D3/Angle2D',
    component: Angle2D
  });
</script>

<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { Angle2DProps } from '$lib/d3/Angle2D.svelte';

  setTemplate(template);
</script>

{#snippet template(args: Angle2DProps)}
  <div class="h-[300px] rounded-lg overflow-hidden">
    <Canvas2D>
      <Angle2D startAngle={0} endAngle={Math.PI / 2} color={PrimeColor.black} {...args} />
    </Canvas2D>
  </div>
{/snippet}

<Story name="With color" args={{ color: PrimeColor.raspberry }} />

<!-- Move origin -->
<Story name="With origin defined" args={{ origin: new Vector2(1, 1) }} />

<!-- Change width -->
<Story name="With width defined" args={{ width: 0.1 }} />

<!-- Change distance -->
<Story name="With distance defined" args={{ distance: 2 }} />

<!-- Add arrow -->
<Story name="With arrow" args={{ hasHead: true, startAngle: 0, endAngle: Math.PI / 2 }} />
