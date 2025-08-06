<script module>
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Vector3 } from 'three';
  import InfiniteLine3D from '../InfiniteLine3D.svelte';

  const { Story } = defineMeta({
    title: 'Threlte/InfiniteLine3D',
    component: InfiniteLine3D
  });
</script>

<script lang="ts">
  import Axis3D from '../Axis3D.svelte';
  import Canvas3D from '../Canvas3D.svelte';
  import type { InfiniteLine3DProps } from '../InfiniteLine3D.svelte';
</script>

{#snippet template(args: InfiniteLine3DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas3D>
      <InfiniteLine3D {...args} />
      <Axis3D hideOrigin />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Line3D component. -->
<Story
  name="Default"
  args={{
    origin: new Vector3(0, 0, 0),
    direction: new Vector3(2, 0, 1),
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
    direction: new Vector3(2, 0, 1),
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
    direction: new Vector3(2, 0, 1),
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
    direction: new Vector3(2, 0, 1),
    color: PrimeColor.darkGreen,
    isDashed: false,
    alwaysOnTop: true
  }}
  {template}
/>
