<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Vector3 } from 'three';
  import Arc3D from '../Arc3D.svelte';

  const { Story } = defineMeta({
    title: 'Threlte/Arc3D',
    component: Arc3D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import type { Arc3DProps } from '../Arc3D.svelte';
  import Axis3D from '../Axis3D.svelte';
  import Canvas3D from '../Canvas3D.svelte';
</script>

{#snippet template(args: Arc3DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas3D>
      <Arc3D {...args} />
      <Axis3D hideOrigin hideTicks />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Arc3D component. It displays a black arc
  between two vectors in 3D space. -->
<Story
  name="Default"
  args={{
    points: [new Vector3(1, 0, 0), new Vector3(0, 1, 0)],
    color: PrimeColor.black,
    origin: new Vector3(0, 0, 0),
    pointsOnArc: 15
  }}
  {template}
/>

<!-- Colored Arc. This story demonstrates an arc with a custom color (raspberry). It shows how color
  can be used to distinguish different arcs in a 3D space. -->
<Story
  name="Colored Arc"
  args={{
    points: [new Vector3(1, 1, 0), new Vector3(-1, 1, 0)],
    color: PrimeColor.raspberry,
    origin: new Vector3(0, 0, 0),
    pointsOnArc: 20
  }}
  {template}
/>

<!-- Custom Origin. This story shows an arc with a custom origin point, demonstrating how arcs can
  be positioned anywhere in 3D space. -->
<Story
  name="Custom Origin"
  args={{
    points: [new Vector3(1, 1, 0), new Vector3(-1, 2, 0)],
    color: PrimeColor.blue,
    origin: new Vector3(1, 1, 1),
    pointsOnArc: 10
  }}
  {template}
/>

<!-- Custom Resolution. This story demonstrates an arc with a custom resolution, showcasing how the
  number of points used to draw the arc can affect its smoothness. -->
<Story
  name="Custom Resolution"
  args={{
    points: [new Vector3(1, 1, 0), new Vector3(-1, 2, 0)],
    color: PrimeColor.darkGreen,
    origin: new Vector3(0, 0, 0),
    pointsOnArc: 100
  }}
  {template}
/>
