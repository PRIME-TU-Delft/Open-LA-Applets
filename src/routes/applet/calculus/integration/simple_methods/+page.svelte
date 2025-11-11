<script lang="ts">
  import { page } from '$app/state';
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Parallelogram2D from '$lib/d3/Parallelogram2D.svelte';
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

  const searchParams = page?.url?.searchParams;
  const rule = searchParams.get('rule');

  let defaultRule = 'applets.calculus.integration.left_rectangle.title';

  if (rule === 'trapezoid') {
    defaultRule = 'applets.calculus.integration.trapezoid_rule.title';
  } else if (rule === 'simpson') {
    defaultRule = 'applets.calculus.integration.simpson_rule.title';
  }

  const controls = Controls.addDropdown(defaultRule, [
    'applets.calculus.integration.left_rectangle.title',
    'applets.calculus.integration.trapezoid_rule.title',
    'applets.calculus.integration.simpson_rule.title'
  ]);

  const xR = $derived(draggables[0].position.x);
  const xL = $derived(draggables[1].position.x);

  const xM = $derived((xL + xR) / 2);

  const simpsonQuadraticFunc = $derived((x: number) => {
    const yL = func(xL);
    const yM = func(xM);
    const yR = func(xR);

    const L0 = ((x - xM) * (x - xR)) / ((xL - xM) * (xL - xR));
    const L1 = ((x - xL) * (x - xR)) / ((xM - xL) * (xM - xR));
    const L2 = ((x - xL) * (x - xM)) / ((xR - xL) * (xR - xM));

    return yL * L0 + yM * L1 + yR * L2;
  });

  const areaTrapezoid = $derived(((func(xL) + func(xR)) * (xR - xL)) / 2);
  const areaRectangle = $derived(func(xL) * (xR - xL));

  const simpsonEstimate = $derived(((xR - xL) / 6) * (func(xL) + 4 * func(xM) + func(xR)));

  const area = $derived.by(() => {
    if (controls[0] == 'applets.calculus.integration.left_rectangle.title') return areaRectangle;
    if (controls[0] == 'applets.calculus.integration.trapezoid_rule.title') return areaTrapezoid;
    if (controls[0] == 'applets.calculus.integration.simpson_rule.title') return simpsonEstimate;

    return 0;
  });

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

<Canvas2D {draggables} {formulas} {controls} cameraPosition={new Vector2(4, 2)}>
  <ExplicitFunction2D
    {func}
    color={PrimeColor.blue}
    integral={{
      xLeft: xL,
      xRight: xR,
      fillStyle: 'full'
    }}
  />

  {#if controls[0] == 'applets.calculus.integration.left_rectangle.title'}
    <Parallelogram2D
      points={[new Vector2(xL, 0), new Vector2(xR, 0), new Vector2(xL, func(xL))]}
      color={PrimeColor.orange + PrimeColor.opacity(0.6)}
      strokeColor={PrimeColor.orange}
      strokeWidth={1}
      fillStyle="dashed"
    />
  {/if}

  {#if controls[0] == 'applets.calculus.integration.trapezoid_rule.title'}
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
  {/if}

  <Point2D color={PrimeColor.orange} position={new Vector2(xL, func(xL))} />
  <Latex2D
    position={new Vector2(xL - 0.1, func(xL) + 0.6)}
    latex="f(x_L)"
    color={PrimeColor.orange}
  />

  {#if controls[0] == 'applets.calculus.integration.trapezoid_rule.title' || controls[0] == 'applets.calculus.integration.simpson_rule.title'}
    <Point2D color={PrimeColor.orange} position={new Vector2(xR, func(xR))} />
    <Latex2D
      position={new Vector2(xR - 0.1, func(xR) + 0.6)}
      latex="f(x_R)"
      color={PrimeColor.orange}
    />
  {/if}

  {#if controls[0] == 'applets.calculus.integration.simpson_rule.title'}
    <Point2D color={PrimeColor.orange} position={new Vector2(xM, 0)} />
    <Latex2D position={new Vector2(xM - 0.1, -0.05)} latex="x_M" color={PrimeColor.orange} />

    <Point2D color={PrimeColor.orange} position={new Vector2(xM, func(xM))} />
    <Latex2D
      position={new Vector2(xM - 0.1, func(xM) + 0.6)}
      latex="f(x_M)"
      color={PrimeColor.orange}
    />

    <Line2D
      start={new Vector2(xL, 0)}
      end={new Vector2(xR, 0)}
      color={PrimeColor.orange}
      width={0.05}
    />
    <Line2D
      start={new Vector2(xL, 0)}
      end={new Vector2(xL, func(xL))}
      color={PrimeColor.orange}
      width={0.05}
    />
    <Line2D
      start={new Vector2(xR, 0)}
      end={new Vector2(xR, func(xR))}
      color={PrimeColor.orange}
      width={0.05}
    />

    <ExplicitFunction2D
      func={simpsonQuadraticFunc}
      color={PrimeColor.orange}
      xMin={xL}
      xMax={xR}
      integral={{
        xLeft: xL,
        xRight: xR,
        fillStyle: 'dashed'
      }}
    />
  {/if}
</Canvas2D>
