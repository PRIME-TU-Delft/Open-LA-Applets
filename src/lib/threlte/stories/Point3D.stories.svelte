<script module>
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Vector3 } from 'three';
  import Point3D from '../Point3D.svelte';

  const { Story } = defineMeta({
    title: '3D Components/Point3D',
    component: Point3D
  });
</script>

<script lang="ts">
  import Axis3D from '../Axis3D.svelte';
  import Canvas3D from '../Canvas3D.svelte';
  import type { Point3DProps } from '../Point3D.svelte';
</script>

{#snippet template(args: Point3DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas3D>
      <Point3D {...args} />
      <Axis3D hideOrigin hideTicks />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Point3D component. -->
<Story
  name="Default"
  args={{
    position: new Vector3(0, 0, 0),
    color: PrimeColor.darkGreen,
    size: 0.125
  }}
  {template}
/>

<!-- This story demonstrates a Point3D with a custom position and color. -->
<Story
  name="Custom Position and Color"
  args={{
    position: new Vector3(1, 0, 1),
    color: PrimeColor.raspberry,
    size: 0.125
  }}
  {template}
/>

<!-- This story shows a larger Point3D. -->
<Story
  name="Large Point"
  args={{
    position: new Vector3(0, 1, 0),
    color: PrimeColor.blue,
    size: 0.25
  }}
  {template}
/>

<!-- This story demonstrates a Point3D that is not always on top. -->
<Story
  name="Not Always on Top"
  args={{
    position: new Vector3(-1, 0, 1),
    color: PrimeColor.orange,
    size: 0.125,
    alwaysOnTop: true
  }}
  {template}
/>
