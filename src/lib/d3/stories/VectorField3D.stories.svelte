<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VectorField3D from '../VectorField3D.svelte';
  const { Story } = defineMeta({
    title: '3D Components/VectorField3D',
    component: VectorField3D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import type { ComponentProps } from 'svelte';
  import { Vector3 } from 'three';

  const rotation = (x: number, y: number) => new Vector3(-y, x, 0);
  const radial = (x: number, y: number, z: number) => new Vector3(x, y, z);
  const saddle = (x: number, y: number) => new Vector3(x, -y, 0);
</script>

{#snippet template(args: ComponentProps<typeof VectorField3D>)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas3D>
      <VectorField3D {...args} />
    </Canvas3D>
  </div>
{/snippet}

<Story
  name="Rotation field"
  args={{
    f: rotation,
    xRange: [-2, 2] as [number, number],
    yRange: [-2, 2] as [number, number],
    zRange: [-2, 2] as [number, number],
    step: 1,
    color: PrimeColor.blue
  }}
  {template}
/>

<Story
  name="Radial field"
  args={{
    f: radial,
    xRange: [-2, 2] as [number, number],
    yRange: [-2, 2] as [number, number],
    zRange: [-2, 2] as [number, number],
    step: 1,
    color: PrimeColor.raspberry
  }}
  {template}
/>

<Story
  name="Saddle field"
  args={{
    f: saddle,
    xRange: [-2, 2] as [number, number],
    yRange: [-2, 2] as [number, number],
    zRange: [-2, 2] as [number, number],
    step: 1,
    color: PrimeColor.darkGreen
  }}
  {template}
/>

<Story
  name="Unscaled arrows"
  args={{
    f: rotation,
    xRange: [-2, 2] as [number, number],
    yRange: [-2, 2] as [number, number],
    zRange: [-2, 2] as [number, number],
    step: 1,
    normalize: false,
    color: PrimeColor.black
  }}
  {template}
/>

<Story
  name="Custom step and color function"
  args={{
    f: rotation,
    xRange: [-2, 2] as [number, number],
    yRange: [-2, 2] as [number, number],
    zRange: [-2, 2] as [number, number],
    step: 0.5,
    colorFn: (x: number, y: number, z: number) =>
      x * y * z >= 0 ? PrimeColor.blue : PrimeColor.raspberry
  }}
  {template}
/>

<Story
  name="Rainbow field"
  args={{
    f: rotation,
    xRange: [-2, 2] as [number, number],
    yRange: [-2, 2] as [number, number],
    zRange: [-2, 2] as [number, number],
    step: 0.5,
    colorFn: (x: number, y: number) => {
      const hue = (Math.atan2(y, x) * 180) / Math.PI + 180;
      return `hsl(${hue}, 100%, 50%)`;
    }
  }}
  {template}
/>
