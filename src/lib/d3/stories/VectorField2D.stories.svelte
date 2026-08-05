<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VectorField2D from '../VectorField2D.svelte';

  const { Story } = defineMeta({
    title: '2D Components/VectorField2D',
    component: VectorField2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas2D from '../Canvas2D.svelte';
  import type { ComponentProps } from 'svelte';
  import { Vector2 } from 'three';

  const rotation = (x: number, y: number) => new Vector2(-y, x);
  const radial = (x: number, y: number) => new Vector2(x, y);
  const saddle = (x: number, y: number) => new Vector2(x, -y);
</script>

{#snippet template(args: ComponentProps<typeof VectorField2D>)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <VectorField2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<Story
  name="Rotation field"
  args={{
    f: rotation,
    xRange: [-2, 2] as [number, number],
    yRange: [-2, 2] as [number, number],
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
    step: 0.5,
    colorFn: (x: number, y: number) => (x * y >= 0 ? PrimeColor.blue : PrimeColor.raspberry)
  }}
  {template}
/>

<Story
  name="Rainbow field"
  args={{
    f: rotation,
    xRange: [-2, 2] as [number, number],
    yRange: [-2, 2] as [number, number],
    step: 0.5,
    colorFn: (x: number, y: number) => {
      const hue = (Math.atan2(y, x) * 180) / Math.PI + 180;
      return `hsl(${hue}, 100%, 50%)`;
    }
  }}
  {template}
/>
