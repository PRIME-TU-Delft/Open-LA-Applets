<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import VectorDeconstruction3D from '../VectorDeconstruction3D.svelte';

  const { Story } = defineMeta({
    title: '3D Components/VectorDeconstruction3D',
    component: VectorDeconstruction3D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas3D from '../Canvas3D.svelte';
  import { Vector3 } from 'three';
  import { type VectorDeconstruction3DProps } from '../VectorDeconstruction3D.svelte';
  import Axis3D from '../Axis3D.svelte';
</script>

{#snippet template(args: VectorDeconstruction3DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas3D>
      <VectorDeconstruction3D {...args} />
      <Axis3D hideOrigin />
    </Canvas3D>
  </div>
{/snippet}

<!-- Vector deconstruction of vector (1, 1, 1) with default parameters -->
<Story name="Default" args={{ p: new Vector3(1, 1, 1) }} {template} />

<!-- Vector deconstruction of vector (2, 0, 1) with changed color -->
<Story name="Color" args={{ p: new Vector3(2, 0, 1), color: PrimeColor.raspberry }} {template} />

<!-- Vector deconstruction of vector (-1, 2, 2) with shown axis points with increased size -->
<Story
  name="Axis points"
  args={{ p: new Vector3(-1, 2, 2), pointSize: 0.1, showAxisPoints: true }}
  {template}
/>
