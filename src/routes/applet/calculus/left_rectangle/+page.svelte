<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import Parallelogram2D from '$lib/d3/Parallelogram2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { _ } from 'svelte-i18n';
  import { Vector2 } from 'three';

  let func = (x: number) => {
    return 4 / Math.sqrt(x + 1);
  };
  let intFunc = (x: number) => {
    return 8 * Math.sqrt(x + 1);
  };

  let xlSnapFunc = (p: Vector2) => {
    let x = Math.min(p.x, xR);
    return new Vector2(x, func(x));
  };
  let xrSnapFunc = (p: Vector2) => {
    let x = Math.max(p.x, xL);
    return new Vector2(x, 0);
  };

  const draggables = [
    new Draggable(new Vector2(2, func(2)), PrimeColor.orange, 'x_L', xlSnapFunc),
    new Draggable(new Vector2(5, 0), PrimeColor.orange, 'x_R', xrSnapFunc)
  ];

  const xL = $derived(draggables[0].position.x);
  const xR = $derived(draggables[1].position.x);

  const formulas = $derived.by(() => [
    new Formula('\\int_{\\$1}^{\\$2} f(x) = \\$3')
      .addAutoParam(round(xL), PrimeColor.orange)
      .addAutoParam(round(xR), PrimeColor.orange)
      .addAutoParam(round(intFunc(xR) - intFunc(xL)), PrimeColor.blue),
    new Formula('\\text{\\$1} = \\$2')
      .addAutoParam($_('applets.common.area'))
      .addAutoParam(round(func(xL) * (xR - xL)), PrimeColor.orange)
  ]);
</script>

<Canvas2D {draggables} {formulas} cameraPosition={new Vector2(4, 2)} title="Left rectangle rule">
  <ExplicitFunction2D
    {func}
    color={PrimeColor.blue}
    integral={{
      xLeft: xL,
      xRight: xR
    }}
  />

  <Parallelogram2D
    points={[new Vector2(xL, 0), new Vector2(xR, 0), new Vector2(xL, func(xL))]}
    color={PrimeColor.orange + PrimeColor.opacity(0.6)}
    strokeColor={PrimeColor.orange}
    strokeWidth={1}
    fillStyle="dashed"
  />
</Canvas2D>
