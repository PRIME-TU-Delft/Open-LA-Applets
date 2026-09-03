<script module>
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Curve3D from '../Curve3D.svelte';

  const { Story } = defineMeta({
    title: '3D Components/Curve3D',
    component: Curve3D
  });
</script>

<script lang="ts">
  import Axis3D from '../Axis3D.svelte';
  import Canvas3D from '../Canvas3D.svelte';
  import type { Curve3DProps } from '../Curve3D.svelte';
</script>

{#snippet template(args: Curve3DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas3D>
      <Curve3D {...args} />
      <Axis3D hideOrigin />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Curve3D component. -->
<Story
  name="Default"
  args={{
    xFunc: (t) => Math.cos(12 * t),
    yFunc: (t) => Math.sin(12 * t),
    zFunc: (t) => 2 * t
  }}
  {template}
/>

<!-- This story showcases a custom `tRange` value for the Curve3D component. -->
<Story
  name="With custom tRange"
  args={{
    xFunc: (t) => Math.cos(12 * t),
    yFunc: (t) => Math.sin(12 * t),
    zFunc: (t) => 2 * t,
    tRange: [-2 * Math.PI, 2 * Math.PI]
  }}
  {template}
/>

<!-- This story showcases a custom `color` value for the Curve3D component. -->
<Story
  name="With custom color"
  args={{
    xFunc: (t) => Math.cos(12 * t),
    yFunc: (t) => Math.sin(12 * t),
    zFunc: (t) => 2 * t,
    color: PrimeColor.raspberry
  }}
  {template}
/>

<!-- This story showcases a custom `zRange` value clipping what is rendered for the Curve3D component. -->
<Story
  name="With zRange clipping"
  args={{
    xFunc: (t) => Math.cos(12 * t),
    yFunc: (t) => Math.sin(12 * t),
    zFunc: (t) => 2 * t,
    tRange: [-2 * Math.PI, 2 * Math.PI],
    zRange: [-Math.PI, Math.PI]
  }}
  {template}
/>

<!-- This story showcases a custom `radius` value for the Curve3D component. -->
<Story
  name="With custom radius"
  args={{
    xFunc: (t) => Math.cos(12 * t),
    yFunc: (t) => Math.sin(12 * t),
    zFunc: (t) => 2 * t,
    radius: 5
  }}
  {template}
/>
