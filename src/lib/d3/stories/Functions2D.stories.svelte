<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: '2D Components/Functions2D',
    subcomponents: { ExplicitFunction2D, ImplicitFunction2D, ParameterizedFunction2D },
    parameters: {
      docs: {
        description: {
          component:
            'There are 3 components for creating functions in 2D: ExplicitFunction2D, ImplicitFunction2D, and ParameterizedFunction2D, shown below.'
        }
      }
    }
  });
</script>

<script lang="ts">
  import Canvas2D from '../Canvas2D.svelte';
  import ExplicitFunction2D, { type ExplicitFunction2DProps } from '../ExplicitFunction2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import ImplicitFunction2D, { type ImplicitFunction2DProps } from '../ImplicitFunction2D.svelte';
  import ParameterizedFunction2D, {
    type ParameterizedFunction2DProps
  } from '../ParameterizedFunction2D.svelte';

  let canvasProps = {};
</script>

{#snippet template(
  args: ExplicitFunction2DProps | ImplicitFunction2DProps | ParameterizedFunction2DProps
)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D {...canvasProps}>
      {#if 'xFunc' in args}
        <ParameterizedFunction2D {...args} />
      {:else if 'zeroFunc' in args}
        <ImplicitFunction2D {...args} />
      {:else}
        <ExplicitFunction2D {...args} />
      {/if}
    </Canvas2D>
  </div>
{/snippet}

<!-- y = x^2 explicit function with increased width -->
<Story
  name="Explicit"
  args={{ func: (x) => x * x, color: PrimeColor.raspberry, width: 0.06, showArrows: false }}
  {template}
/>

<!-- y = sin(x) explicit function with restricted domain [-pi, pi] and with arrows shown -->
<Story
  name="Explicit sin(x)"
  args={{
    func: (x) => Math.sin(x),
    color: PrimeColor.yellow,
    xMin: -3.14,
    xMax: 3.14,
    width: 0.02,
    showArrows: true
  }}
  {template}
/>

<!-- y = 4/sqrt(x+1) explicit function with integral coloring shown in [2,5] -->
<Story
  name="Explicit with integral coloring"
  args={{
    func: (x) => 4 / Math.sqrt(x + 1),
    color: PrimeColor.yellow,
    integral: {
      xLeft: 2,
      xRight: 5,
      fillStyle: 'full'
    }
  }}
  {template}
/>

<!-- x = cost(t); y = sin(t) parameterized function -->
<Story
  name="Parameterized"
  args={{
    xFunc: (t) => Math.cos(t),
    yFunc: (t) => Math.sin(t),
    tEnd: 4,
    color: PrimeColor.cyan,
    showArrows: false
  }}
  {template}
/>

<!-- x^2 + y^2 = 1 implicit relation -->
<Story
  name="Implicit"
  args={{
    zeroFunc: (x, y) => x * x + y * y - 1,
    yMin: -1.1,
    yMax: 1.1,
    xMin: -1.1,
    xMax: 1.1,
    color: PrimeColor.darkGreen,
    showArrows: false
  }}
  {template}
/>
