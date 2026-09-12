<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Pendulum2D from '../Pendulum2D.svelte';

  const { Story } = defineMeta({
    title: '2D Components/Pendulum2D',
    component: Pendulum2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas2D from '../Canvas2D.svelte';
  import type { Pendulum2DProps } from '../Pendulum2D.svelte';
</script>

{#snippet template(args: Pendulum2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <Pendulum2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<Story name="Default" args={{}} {template} />

<!-- Bob with a label rendered inside it -->
<Story name="With label" args={{ bobLabel: 'm' }} {template} />

<!-- stringAngle swings the pendulum (degrees, counterclockwise from vertical) -->
<Story name="Swung" args={{ stringAngle: 45, bobLabel: 'm' }} {template} />

<!-- Custom colors for the string and bob -->
<Story
  name="With custom colors"
  args={{ stringColor: PrimeColor.raspberry, bobColor: PrimeColor.cyan, bobLabel: 'm' }}
  {template}
/>
