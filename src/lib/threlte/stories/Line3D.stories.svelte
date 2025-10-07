<script module>
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Vector3 } from 'three';
  import Line3D from '../Line3D.svelte';

  const { Story } = defineMeta({
    title: '3D Components/Line3D',
    component: Line3D
  });
</script>

<script lang="ts">
  import Axis3D from '../Axis3D.svelte';
  import Canvas3D from '../Canvas3D.svelte';
  import type { Line3DProps } from '../Line3D.svelte';
</script>

{#snippet template(args: Line3DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas3D>
      <Line3D {...args} />
      <Axis3D hideOrigin />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Line3D component. -->
<Story
  name="Default"
  args={{
    origin: new Vector3(0, 0, 0),
    endPoint: new Vector3(2, 0, 1),
    color: PrimeColor.getRandomColor(),
    isDashed: false,
    alwaysOnTop: false
  }}
  {template}
/>

<!-- This story demonstrates the Line3D component with a custom color and thickness. -->
<Story
  name="Custom Color and Thickness"
  args={{
    endPoint: new Vector3(2, 0, 1),
    color: '#FF0000',
    isDashed: false,
    alwaysOnTop: false,
    radius: 2
  }}
  {template}
/>

<!-- This story shows the Line3D component with dashed lines. -->
<Story
  name="Dashed Line"
  args={{
    endPoint: new Vector3(2, 0, 1),
    color: '#FF0000',
    isDashed: true,
    alwaysOnTop: false
  }}
  {template}
/>

<!-- This story demonstrates the Line3D component always rendering on top. -->
<Story
  name="Always on Top"
  args={{
    endPoint: new Vector3(2, 0, 1),
    color: PrimeColor.darkGreen,
    isDashed: false,
    alwaysOnTop: true
  }}
  {template}
/>
