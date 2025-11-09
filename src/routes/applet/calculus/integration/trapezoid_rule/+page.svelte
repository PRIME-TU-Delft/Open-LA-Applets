<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Polygon2D from '$lib/d3/Polygon2D.svelte';
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
    let x = Math.max(Math.min(p.x, xR), -0.99);
    return new Vector2(x, 0);
  };
  let xrSnapFunc = (p: Vector2) => {
    let x = Math.max(p.x, xL);
    return new Vector2(x, 0);
  };

  const draggables = [
    new Draggable(new Vector2(4.5, 0), PrimeColor.orange, 'x_R', xrSnapFunc, undefined, 'bottom'),
    new Draggable(new Vector2(1.5, 0), PrimeColor.orange, 'x_L', xlSnapFunc, undefined, 'bottom')
  ];

  const xR = $derived(draggables[0].position.x);
  const xL = $derived(draggables[1].position.x);

  const area = $derived(((func(xL) + func(xR)) * (xR - xL)) / 2);

  const formulas = $derived.by(() => [
    new Formula('\\int_{\\$1}^{\\$2} f(x) \\,dx = \\$3')
      .addAutoParam(round(xL), PrimeColor.orange)
      .addAutoParam(round(xR), PrimeColor.orange)
      .addAutoParam(round(intFunc(xR) - intFunc(xL)), PrimeColor.blue),
    new Formula('\\text{\\$1} = \\$2')
      .addAutoParam($_('applets.common.area'))
      .addAutoParam(round(area), PrimeColor.orange)
  ]);
</script>

<Canvas2D
  {draggables}
  {formulas}
  cameraPosition={new Vector2(4, 2)}
  title={$_('applets.calculus.integration.trapezoid_rule.title')}
>
  <ExplicitFunction2D
    {func}
    color={PrimeColor.blue}
    integral={{
      xLeft: xL,
      xRight: xR
    }}
  />

  <Polygon2D
    points={[
      new Vector2(xL, 0),
      new Vector2(xR, 0),
      new Vector2(xR, func(xR)),
      new Vector2(xL, func(xL))
    ]}
    color={PrimeColor.orange + PrimeColor.opacity(0.6)}
    strokeColor={PrimeColor.orange}
    strokeWidth={1}
    fillStyle="dashed"
  />

  <Point2D color={PrimeColor.orange} position={new Vector2(xL, func(xL))} />
  <Latex2D
    position={new Vector2(xL - 0.1, func(xL) + 0.6)}
    latex="f(x_L)"
    color={PrimeColor.orange}
  />

  <Point2D color={PrimeColor.orange} position={new Vector2(xR, func(xR))} />
  <Latex2D
    position={new Vector2(xR - 0.1, func(xR) + 0.6)}
    latex="f(x_R)"
    color={PrimeColor.orange}
  />
</Canvas2D>
