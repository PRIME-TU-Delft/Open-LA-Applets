<script module>
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Surface3D from '../Surface3D.svelte';

  const { Story } = defineMeta({
    title: 'Threlte/Surface3D',
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
    func: (x, y) => x * x + x * y + y * y - 3,
    color: PrimeColor.cyan,
    opacity: 0.5
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
