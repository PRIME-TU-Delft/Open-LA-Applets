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
  import { integral, round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { ComputeEngine } from '@cortex-js/compute-engine';
  import { _ } from 'svelte-i18n';
  import { Vector2 } from 'three';

  let xlSnapFunc = (p: Vector2) => {
    let x = Math.min(p.x, xR);
    return new Vector2(x, 0);
  };
  let xrSnapFunc = (p: Vector2) => {
    let x = Math.max(p.x, xL);
    return new Vector2(x, 0);
  };

  const searchParams = page?.url?.searchParams;
  const ruleParam = searchParams.get('rule');

  let defaultRule = 'applets.calculus.integration.simple_methods.left';

  if (ruleParam === 'right') {
    defaultRule = 'applets.calculus.integration.simple_methods.right';
  } else if (ruleParam === 'trapezoid') {
    defaultRule = 'applets.calculus.integration.simple_methods.trapezoid';
  } else if (ruleParam === 'midpoint') {
    defaultRule = 'applets.calculus.integration.simple_methods.midpoint';
  } else if (ruleParam === 'simpson') {
    defaultRule = 'applets.calculus.integration.simple_methods.simpson';
  }

  let defaultFunction = searchParams.get('function') || '\\sqrt{1 + {\\cos{(x)}}^2 }';

  const controls = Controls.addFunction(defaultFunction, 'f(x)', PrimeColor.blue).addDropdown(
    defaultRule,
    [
      'applets.calculus.integration.simple_methods.left',
      'applets.calculus.integration.simple_methods.right',
      'applets.calculus.integration.simple_methods.trapezoid',
      'applets.calculus.integration.simple_methods.midpoint',
      'applets.calculus.integration.simple_methods.simpson'
    ]
  );

  const urlXL = searchParams.get('xL');
  const urlXR = searchParams.get('xR');

  let isXLLatex = false;
  let isXRLatex = false;

  let defaultXL: number = 1.5;
  let defaultXR: number = 4.5;

  function parseLatex(latex: string): number {
    const ce = new ComputeEngine();
    const parsed = ce.parse(latex);

    if (!parsed.isValid || parsed.has('Error') || parsed.has('Nothing')) return NaN;

    return parseFloat(parsed.N() as unknown as string);
  }

  if (urlXL != null) {
    defaultXL = parseFloat(urlXL);

    const latexXL = parseLatex(urlXL);
    if (!isNaN(latexXL)) {
      defaultXL = latexXL;
      isXLLatex = true;
    }

    if (isNaN(defaultXL)) {
      defaultXL = 1.5;
    }
  }

  if (urlXR != null) {
    defaultXR = parseFloat(urlXR);

    const latexXR = parseLatex(urlXR);
    if (!isNaN(latexXR)) {
      defaultXR = latexXR;
      isXRLatex = true;
    }

    if (isNaN(defaultXR)) {
      defaultXR = 4.5;
    }
  }

  const draggables = [
    new Draggable(
      new Vector2(defaultXR, 0),
      PrimeColor.orange,
      'x_R',
      xrSnapFunc,
      undefined,
      'bottom'
    ),
    new Draggable(
      new Vector2(defaultXL, 0),
      PrimeColor.orange,
      'x_L',
      xlSnapFunc,
      undefined,
      'bottom'
    )
  ];

  let func = $derived(controls[0]);

  let funcPoints = (x: number) => {
    let result = func(x);

    if (Number.isNaN(result)) return 0;

    return result;
  };

  let intFunc = (a: number, b: number) => {
    return integral(func, a, b);
  };

  const currentRule = $derived(
    controls[1].replace('applets.calculus.integration.simple_methods.', '')
  );

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

  const area = $derived.by(() => {
    if (currentRule == 'left') return func(xL) * (xR - xL);
    if (currentRule == 'right') return func(xR) * (xR - xL);
    if (currentRule == 'trapezoid') return ((func(xL) + func(xR)) * (xR - xL)) / 2;
    if (currentRule == 'midpoint') return func(xM) * (xR - xL);

    if (currentRule == 'simpson') return ((xR - xL) / 6) * (func(xL) + 4 * func(xM) + func(xR));

    return 0;
  });

  const formulas = $derived.by(() => {
    let I = intFunc(xL, xR);

    let f = [
      new Formula('\\int_{\\$1}^{\\$2} \\$4 \\,dx = \\$3')
        .addAutoParam(isXLLatex && xL == defaultXL ? urlXL || '' : round(xL), PrimeColor.orange)
        .addAutoParam(isXRLatex && xR == defaultXR ? urlXR || '' : round(xR), PrimeColor.orange)
        .addAutoParam(!Number.isNaN(I) ? round(I) : 'DIV', PrimeColor.blue)
        .addAutoParam('f(x)', PrimeColor.blue),
      new Formula('\\text{\\$1} = \\$2')
        .addAutoParam($_('applets.common.area'))
        .addAutoParam(round(area), PrimeColor.orange)
    ];

    if (currentRule == 'simpson') {
      f[1] = new Formula('\\frac{x_R - x_L}{6}(f(x_L) + 4f(x_M) + f(x_R)) = \\$1').addAutoParam(
        round(area),
        PrimeColor.orange
      );
    }

    return f;
  });
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

  {#if currentRule == 'left'}
    <Parallelogram2D
      points={[new Vector2(xL, 0), new Vector2(xR, 0), new Vector2(xL, func(xL))]}
      color={PrimeColor.orange + PrimeColor.opacity(0.6)}
      strokeColor={PrimeColor.orange}
      strokeWidth={1}
      fillStyle="dashed"
    />
  {:else if currentRule == 'right'}
    <Parallelogram2D
      points={[new Vector2(xL, 0), new Vector2(xR, 0), new Vector2(xL, func(xR))]}
      color={PrimeColor.orange + PrimeColor.opacity(0.6)}
      strokeColor={PrimeColor.orange}
      strokeWidth={1}
      fillStyle="dashed"
    />
  {:else if currentRule == 'midpoint'}
    <Parallelogram2D
      points={[new Vector2(xL, 0), new Vector2(xR, 0), new Vector2(xL, func(xM))]}
      color={PrimeColor.orange + PrimeColor.opacity(0.6)}
      strokeColor={PrimeColor.orange}
      strokeWidth={1}
      fillStyle="dashed"
    />
  {:else if currentRule == 'trapezoid'}
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

  {#if currentRule != 'right' && currentRule != 'midpoint'}
    <Point2D color={PrimeColor.orange} position={new Vector2(xL, func(xL))} />
    <Latex2D
      position={new Vector2(xL - 0.1, funcPoints(xL) + 0.6)}
      latex="f(x_L)"
      color={PrimeColor.orange}
    />
  {:else if currentRule == 'right'}
    <Point2D color={PrimeColor.orange} position={new Vector2(xR, func(xR))} />
    <Latex2D
      position={new Vector2(xR - 0.1, funcPoints(xR) + 0.6)}
      latex="f(x_R)"
      color={PrimeColor.orange}
    />
  {/if}

  {#if currentRule == 'trapezoid' || currentRule == 'simpson'}
    <Point2D color={PrimeColor.orange} position={new Vector2(xR, func(xR))} />
    <Latex2D
      position={new Vector2(xR - 0.1, funcPoints(xR) + 0.6)}
      latex="f(x_R)"
      color={PrimeColor.orange}
    />
  {/if}

  {#if currentRule == 'simpson' || currentRule == 'midpoint'}
    <Point2D color={PrimeColor.orange} position={new Vector2(xM, 0)} />
    <Latex2D position={new Vector2(xM - 0.1, -0.05)} latex="x_M" color={PrimeColor.orange} />

    <Point2D color={PrimeColor.orange} position={new Vector2(xM, func(xM))} />
    <Latex2D
      position={new Vector2(xM - 0.1, funcPoints(xM) + 0.6)}
      latex="f(x_M)"
      color={PrimeColor.orange}
    />
  {/if}

  {#if currentRule == 'simpson'}
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
