<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FillBetweenFunctions2D from '../FillBetweenFunctions2D.svelte';

  const { Story } = defineMeta({
    title: '2D Components/FillBetweenFunctions2D',
    component: FillBetweenFunctions2D
  });
</script>

<script lang="ts">
  import Canvas2D from '../Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import type { FillBetweenFunctions2DProps } from '../FillBetweenFunctions2D.svelte';
</script>

{#snippet template(args: FillBetweenFunctions2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <FillBetweenFunctions2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<!-- Fills the area between y = x^2 and y = x over the full domain, without shading the integral region -->
<Story
  name="Between two functions"
  args={{
    func1: (x: number) => x * x,
    func2: (x: number) => x,
    color1: PrimeColor.raspberry,
    color2: PrimeColor.blue
  }}
  {template}
/>

<!-- Solid fill of the integral region between the two functions -->
<Story
  name="With solid integral fill"
  args={{
    func1: (x: number) => 0.5 * x * x,
    func2: () => 0,
    color1: PrimeColor.raspberry,
    color2: PrimeColor.black,
    integral: {
      xLeft: -2,
      xRight: 2,
      fillStyle: 'full'
    }
  }}
  {template}
/>

<!-- Dashed hatch fill of the integral region between the two functions -->
<Story
  name="With dashed integral fill"
  args={{
    func1: (x: number) => 0.5 * x * x,
    func2: () => 0,
    color1: PrimeColor.raspberry,
    color2: PrimeColor.black,
    integral: {
      xLeft: -2,
      xRight: 2,
      fillStyle: 'dashed'
    }
  }}
  {template}
/>

<!-- integral.opacity (added in #501) controls the fill transparency independently of color1/color2 -->
<Story
  name="With custom fill opacity"
  args={{
    func1: (x: number) => 0.5 * x * x,
    func2: () => 0,
    color1: PrimeColor.raspberry,
    color2: PrimeColor.black,
    integral: {
      xLeft: -2,
      xRight: 2,
      fillStyle: 'full',
      color: PrimeColor.orange,
      opacity: 0.15
    }
  }}
  {template}
/>
