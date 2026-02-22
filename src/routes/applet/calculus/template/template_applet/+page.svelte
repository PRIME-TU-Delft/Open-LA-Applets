<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  type Domain = {
    xMin?: number;
    xMax?: number;
  };

  class AppletObject {}

  class FunctionFragment extends AppletObject {
    func: (x: number) => number;
    color: PrimeColor;
    domain: Domain | undefined = undefined;

    constructor(func: (x: number) => number, color: PrimeColor, domain?: Domain) {
      super();

      this.func = func;
      this.color = color;
      this.domain = domain;
    }
  }

  const appletObjects: AppletObject[] = [
    new FunctionFragment((x: number) => x ** 2 - 2, PrimeColor.raspberry, { xMin: -1, xMax: 2.14 })
  ];
</script>

<Canvas2D>
  {#each appletObjects as object, idx (idx)}
    {#if object instanceof FunctionFragment}
      <ExplicitFunction2D
        func={object.func}
        color={object.color.toString()}
        xMin={object.domain?.xMin}
        xMax={object.domain?.xMax}
      />
    {/if}
  {/each}
</Canvas2D>
