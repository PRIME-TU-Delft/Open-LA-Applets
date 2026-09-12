<script module>
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Surface3D from '../Surface3D.svelte';
  import { Vector2 } from 'three';

  const { Story } = defineMeta({
    title: '3D Components/Surface3D',
    component: Surface3D
  });
</script>

<script lang="ts">
  import Axis3D from '../Axis3D.svelte';
  import Canvas3D from '../Canvas3D.svelte';
  import { type Surface3DProps } from '../Surface3D.svelte';
</script>

{#snippet template(args: Surface3DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas3D>
      <Surface3D {...args} />
      <Axis3D hideOrigin />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Surface3D component. -->
<Story
  name="Default"
  args={{
    func: (x, y) => x * x + x * y + y * y - 3
  }}
  {template}
/>

<!-- This story showcases the Surface3D component with wireframe. -->
<Story
  name="Wireframe"
  args={{
    func: (x, y) => -Math.sqrt(x * x + y * y) + 5,
    color: PrimeColor.raspberry,
    wireframe: true,
    resolution: 100
  }}
  {template}
/>

<!-- This story showcases the Surface3D component with wireframe and surface. -->
<Story
  name="Wireframe and surface"
  args={{
    func: (x, y) => -Math.sqrt(x * x + y * y) + 5,
    color: PrimeColor.raspberry,
    wireframe: true,
    surface: true,
    resolution: 100
  }}
  {template}
/>

<!-- This story showcases the Surface3D component with wireframe and surface with different colors. -->
<Story
  name="Wireframe and surface with different colors"
  args={{
    func: (x, y) => -Math.sqrt(x * x + y * y) + 5,
    color: PrimeColor.raspberry,
    wireframe: true,
    surface: true,
    resolution: 100,
    wireColor: PrimeColor.black
  }}
  {template}
/>

<!-- This story showcases the Surface3D component with a non-default rectangular domain. -->
<Story
  name="Rectangular domain"
  args={{
    func: (x, y) => -Math.sqrt(x * x + y * y) + 5,
    color: PrimeColor.raspberry,
    wireframe: true,
    surface: true,
    resolution: 100,
    wireColor: PrimeColor.black,
    xRange: [0, 3],
    yRange: [-2, 3]
  }}
  {template}
/>

<!-- This story showcases the Surface3D component with a polygonal domain.

If `polygon` is provided, any values in `xRange` and `yRange` will be ignored.

The `polygon` must be a list of Vector2 elements, in (counter-)clockwise order.
-->
<Story
  name="Polygonal domain"
  args={{
    func: (x, y) => -Math.sqrt(x * x + y * y) + 5,
    color: PrimeColor.raspberry,
    wireframe: true,
    surface: true,
    resolution: 10,
    wireColor: PrimeColor.black,
    polygon: [new Vector2(0, 0), new Vector2(0, 5), new Vector2(2, 6), new Vector2(5, 3)]
  }}
  {template}
/>
