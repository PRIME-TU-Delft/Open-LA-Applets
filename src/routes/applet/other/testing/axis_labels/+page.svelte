<script lang="ts">
  import ImplicitFunction2D from '$lib/d3/ImplicitFunction2D.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
</script>

<Canvas2D
  labels={{
    xLabel: 'x',
    yLabel: 'y'
  }}
>
  <ImplicitFunction2D
    zeroFunc={(x, y) =>
      x ** 2 / 3 ** 2 +
      y ** 2 / 2 ** 2 -
      (2 * x * y * Math.cos(2.2)) / (3 * 2) -
      Math.sin(2.2) ** 2}
    color={PrimeColor.blue}
    stepSize={0.1}
  />
  <ImplicitFunction2D
    zeroFunc={(x, y) => x ** 2 - 4 * x * y + y ** 2 - 3}
    color={PrimeColor.black}
  />
</Canvas2D>
