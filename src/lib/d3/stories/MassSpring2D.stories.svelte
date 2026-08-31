<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MassSpring2D from '../MassSpring2D.svelte';

  const { Story } = defineMeta({
    title: '2D Components/MassSpring2D',
    component: MassSpring2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas2D from '../Canvas2D.svelte';
  import type { MassSpring2DProps } from '../MassSpring2D.svelte';
</script>

{#snippet template(args: MassSpring2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <MassSpring2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<Story name="Default" args={{}} {template} />

<!-- Mass with a label rendered inside the block -->
<Story name="With label" args={{ massLabel: 'm' }} {template} />

<!-- massLocation moves the mass (and stretches/compresses the spring) along the string -->
<Story name="Stretched spring" args={{ massLocation: -3, massLabel: 'm' }} {template} />

<!-- Custom colors for spring and mass -->
<Story
  name="With custom colors"
  args={{ springColor: PrimeColor.raspberry, massColor: PrimeColor.cyan, massLabel: 'm' }}
  {template}
/>

<!-- rotation rotates the whole spring/mass system (clockwise, in degrees) around (center, ceilingTop) -->
<Story name="Rotated" args={{ rotation: 30, massLabel: 'm' }} {template} />
