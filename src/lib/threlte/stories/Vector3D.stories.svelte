<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Vector3D from '../Vector3D.svelte';

  const { Story } = defineMeta({
    title: 'Threlte/Vector3D',
    component: Vector3D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { setTemplate } from '@storybook/addon-svelte-csf';
  import type { Snippet } from 'svelte';
  import { Vector3 } from 'three';
  import Axis3D from '../Axis3D.svelte';
  import Canvas3D from '../Canvas3D.svelte';
  import type { Vector3DProps } from '../Vector3D.svelte';

  setTemplate(template as Snippet<[Partial<Vector3DProps>]>);
</script>

{#snippet template(args: Vector3DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas3D>
      <Vector3D {...args} />
      <Axis3D hideOrigin hideTicks />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Vector3D component. -->
<Story
  name="Default"
  args={{
    color: PrimeColor.darkGreen,
    origin: new Vector3(0, 0, 0),
    direction: new Vector3(1, 1, 0),
    length: 1
  }}
/>

<!-- This story demonstrates a Vector3D with a custom origin and direction. -->
<Story
  name="Custom Origin and Direction"
  args={{
    color: PrimeColor.raspberry,
    origin: new Vector3(-1, -1, -1),
    direction: new Vector3(2, 2, 2)
  }}
/>

<!-- This story shows a dashed Vector3D. -->
<Story
  name="Dashed Vector"
  args={{
    color: PrimeColor.blue,
    origin: new Vector3(0, 0, 0),
    direction: new Vector3(0, 5, 0),
    isDashed: true,
    length: 5
  }}
/>

<!-- This story demonstrates a Vector3D with a specified length. -->
<Story
  name="Specified Length"
  args={{
    color: PrimeColor.orange,
    origin: new Vector3(0, 0, 0),
    direction: new Vector3(1, 1, 0),
    length: 2
  }}
/>

<!-- This story shows a Vector3D without an arrowhead. -->
<Story
  name="No Arrowhead"
  args={{
    color: PrimeColor.darkGreen,
    origin: new Vector3(0, 0, 0),
    direction: new Vector3(1, 0, 1),
    hideHead: true
  }}
/>
