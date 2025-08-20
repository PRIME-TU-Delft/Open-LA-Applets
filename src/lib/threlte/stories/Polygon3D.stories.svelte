<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Polygon3D from '../Polygon3D.svelte';

  const { Story } = defineMeta({
    title: 'Threlte/Polygon3D',
    component: Polygon3D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas3D from '../Canvas3D.svelte';
  import { Vector3 } from 'three';
  import { type Polygon3DProps } from '../Polygon3D.svelte';
  import Axis3D from '../Axis3D.svelte';
</script>

{#snippet template(args: Polygon3DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas3D>
      <Polygon3D {...args} />
      <Axis3D hideOrigin />
    </Canvas3D>
  </div>
{/snippet}

<!-- Polygon with default parameters and some points defining a triangle -->
<Story
  name="Default"
  args={{ points: [new Vector3(2, 1, 0), new Vector3(1, 0, 2), new Vector3(1, 1, 3)] }}
  {template}
/>

<!-- Polygon with color and opacity parameters defined and some points defining a complex shape -->
<Story
  name="Color"
  args={{
    color: PrimeColor.raspberry,
    opacity: 0.5,
    points: [
      new Vector3(1, 1, 0),
      new Vector3(3, 1, 0),
      new Vector3(4, 0, 1.5),
      new Vector3(3, -1, 3),
      new Vector3(1, -1, 3)
    ]
  }}
  {template}
/>

<!-- Polygon defining a triangle, offset by a vector -->
<Story
  name="Offset"
  args={{
    offset: new Vector3(-3, 1.5),
    points: [new Vector3(0, 0, 1), new Vector3(1, 0, 0), new Vector3(1, 1, 0.5)]
  }}
  {template}
/>
