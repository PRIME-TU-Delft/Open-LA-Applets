<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'D3/Functions2D',
    subcomponents: { ExplicitFunction2D, ImplicitFunction2D, ParameterizedFunction2D },
    parameters: {
      docs: {
        description: {
          component: 'There are 3 components for creating functions in 2D: ExplicitFunction2D, ImplicitFunction2D, and ParameterizedFunction2D, shown below.'
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
      {:else if 'yMin' in args && 'yMax' in args}
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
  args={{ func: 'y=x^2', color: PrimeColor.raspberry, width: 0.06, showArrows: false }}
  {template}
/>

<!-- y = sin(x) explicit function with restricted domain [-pi, pi] and with arrows shown -->
<Story
  name="Explicit sin(x)"
  args={{ func: 'y=sin(x)', color: PrimeColor.yellow, xMin: -3.14, xMax:3.14, width: 0.02, showArrows: true }}
  {template}
/>

<!-- x = cost(t); y = sin(t) parameterized function -->
<Story
  name="Parameterized"
  args={{ xFunc: 'cos(t)', yFunc: 'sin(t)', tEnd: 4, color: PrimeColor.cyan, showArrows: false }}
  {template}
/>

<!-- x^2 + y^2 = 1 implicit relation -->
<Story
  name="Implicit"
  args={{ func: 'x^2 + y^2 = 1', yMin: -1.1, yMax: 1.1, xMin: -1.1, xMax: 1.1, color: PrimeColor.darkGreen, showArrows: false }}
  {template}
/>
