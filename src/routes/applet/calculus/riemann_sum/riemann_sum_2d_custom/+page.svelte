<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { integral, round, roundString } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import Parallelogram2D from '$lib/d3/Parallelogram2D.svelte';
  import { page } from '$app/state';
  import { appletState } from '$lib/stores/applet.svelte';
  import { parseNumericalOrLatex } from '$lib/utils/Params';

  const searchParams = page?.url?.searchParams;

  let defaultFunction = searchParams.get('function') || '\\sqrt{1 + {\\cos{(x)}}^2 }';

  const xAxisLetter = searchParams.get('xAxisLetter') || 'x';
  const functionLetter = searchParams.get('functionLetter') || 'f';

  if (xAxisLetter !== 'x') {
    defaultFunction = defaultFunction.replaceAll('x', xAxisLetter);
  }

  let defaultXL = parseNumericalOrLatex(searchParams.get('xL'), 1.5);
  let defaultXR = parseNumericalOrLatex(searchParams.get('xR'), 4.5);

  const cameraX = (defaultXR.value + defaultXL.value) / 2;
  const cameraZoom = Math.min(12 / (defaultXR.value - defaultXL.value), 1);

  let defaultN = parseInt(searchParams.get('n') || '5');

  const methods = [
    'applets.calculus.riemann_sum.riemann_sum_2d.middle',
    'applets.calculus.riemann_sum.riemann_sum_2d.left',
    'applets.calculus.riemann_sum.riemann_sum_2d.right',
    'applets.calculus.riemann_sum.random',
    'applets.calculus.riemann_sum.min',
    'applets.calculus.riemann_sum.max'
  ];

  let currentFuctionString = '';

  const controls = Controls.addFunction(
    defaultFunction,
    `${functionLetter}(${xAxisLetter})`,
    PrimeColor.blue,
    xAxisLetter,
    (latex: string) => {
      currentFuctionString = latex;
    }
  )
    .addDropdown('', methods, PrimeColor.yellow)
    .addSlider(defaultN, 1, 10, 1, PrimeColor.raspberry, {
      label: 'n',
      valueFn: (v) => roundString(v, 0)
    });

  const currentMethod = $derived(
    controls[1]
      .replace('applets.calculus.riemann_sum.', '')
      .replace('riemann_sum_2d.', '')
      .toLowerCase()
  );

  let xlSnapFunc = (p: Vector2) => {
    let x = Math.min(p.x, xR);
    return new Vector2(x, 0);
  };
  let xrSnapFunc = (p: Vector2) => {
    let x = Math.max(p.x, xL);
    return new Vector2(x, 0);
  };

  const draggables = [
    new Draggable(
      new Vector2(defaultXR.value, 0),
      PrimeColor.orange,
      'x_R',
      xrSnapFunc,
      undefined,
      'bottom'
    ),
    new Draggable(
      new Vector2(defaultXL.value, 0),
      PrimeColor.orange,
      'x_L',
      xlSnapFunc,
      undefined,
      'bottom'
    )
  ];

  const xR = $derived(draggables[0].position.x);
  const xL = $derived(draggables[1].position.x);

  const func = $derived(controls[0]);

  const func_display = '\\int_{\\$1}^{\\$2} \\$4 \\, d' + xAxisLetter + ' = \\$3';
  const numRectangles = $derived(round(controls[2], 0));

  const formulas = $derived.by(() => {
    const dx = (xR - xL) / numRectangles;
    const integralResult = integral(func, xL, xR);

    const f1 = new Formula(func_display)
      .addAutoParam(round(xL), PrimeColor.orange)
      .addAutoParam(round(xR), PrimeColor.orange)
      .addAutoParam(round(integralResult, 7), PrimeColor.blue)
      .addAutoParam(functionLetter + '(' + xAxisLetter + ')', PrimeColor.blue);

    const riemannSum = rects.reduce((sum, rect) => sum + rect.height * dx, 0);
    const riemann_display =
      '\\sum_{i=1}^{\\$2} f(x_i^*) \\Delta ' +
      xAxisLetter +
      ' = \\$1, ~~\\Delta ' +
      xAxisLetter +
      '=\\$3';

    const f2 = new Formula(riemann_display)
      .addAutoParam(round(riemannSum, 7), PrimeColor.orange)
      .addAutoParam(numRectangles, PrimeColor.raspberry)
      .addAutoParam(round(dx, 4), PrimeColor.raspberry);

    return new Formulas(f1, f2);
  });

  const rects = $derived.by(() => {
    const dx = (xR - xL) / numRectangles;
    const newRects = [];
    for (let i = 0; i < numRectangles; i++) {
      let x: number;
      if (currentMethod === 'left') {
        x = xL + i * dx;
      } else if (currentMethod === 'right') {
        x = xL + (i + 1) * dx;
      } else if (currentMethod === 'middle') {
        x = xL + (i + 0.5) * dx;
      } else if (currentMethod === 'random') {
        x = xL + i * dx + Math.random() * dx;
      } else if (currentMethod === 'min') {
        // Find the minimum value of func in [x1, x2] by sampling
        const x1 = xL + i * dx;
        const x2 = x1 + dx;
        const samples = 100;
        let minX = x1;
        let minY = func(x1);
        for (let s = 1; s <= samples; s++) {
          const xs = x1 + (s * (x2 - x1)) / samples;
          const ys = func(xs);
          if (ys < minY) {
            minY = ys;
            minX = xs;
          }
        }
        x = minX;
      } else if (currentMethod === 'max') {
        // Find the maximum value of func in [x1, x2] by sampling
        const x1 = xL + i * dx;
        const x2 = x1 + dx;
        const samples = 10;
        let maxX = x1;
        let maxY = func(x1);
        for (let s = 1; s <= samples; s++) {
          const xs = x1 + (s * (x2 - x1)) / samples;
          const ys = func(xs);
          if (ys > maxY) {
            maxY = ys;
            maxX = xs;
          }
        }
        x = maxX;
      } else {
        x = xL + i * dx; // fallback to left method
      }
      const samplePosition = new Vector2(x, func(x));
      const x1 = xL + i * dx;
      const x2 = x1 + dx;
      const y = func(x);

      newRects.push({
        points: [
          new Vector2(x2, Math.min(0, y)),
          new Vector2(x1, Math.min(0, y)),
          new Vector2(x2, Math.max(0, y))
        ] as [Vector2, Vector2, Vector2],
        height: y,
        samplePosition: samplePosition
      });
    }
    return newRects;
  });

  const sampledPoints = $derived.by(() => {
    return rects.map((rect) => new Vector2(rect.samplePosition.x, 0));
  });

  appletState.URLParamsInfo = [
    {
      paramKey: 'function',
      defaultValue: '\\sqrt{1 + {\\cos{(x)}}^2 }',
      description: 'Default function value, in latex form',
      currentValue: () => currentFuctionString
    },
    {
      paramKey: 'n',
      defaultValue: 5,
      description: 'Default number of rectangles',
      currentValue: () => numRectangles.toString()
    },
    {
      paramKey: 'xL',
      defaultValue: 1.5,
      description: 'Default value for left bound (xL)',
      currentValue: () => xL.toFixed(2).toString()
    },
    {
      paramKey: 'xR',
      defaultValue: 4.5,
      description: 'Default value for right bound (xR)',
      currentValue: () => xR.toFixed(2).toString()
    },
    {
      paramKey: 'xAxisLetter',
      defaultValue: 'x',
      description: 'Letter used for the horizontal axis',
      currentValue: () => xAxisLetter
    },
    {
      paramKey: 'functionLetter',
      defaultValue: 'f',
      description: 'Letter used for the function',
      currentValue: () => functionLetter
    }
  ];
</script>

<Canvas2D
  axis={{ showAxisNumbers: true }}
  {controls}
  {formulas}
  {draggables}
  cameraPosition={new Vector2(cameraX, 2)}
  {cameraZoom}
  labels={{ xLabel: xAxisLetter, yLabel: `${functionLetter}(${xAxisLetter})` }}
>
  <ExplicitFunction2D
    {func}
    color={PrimeColor.blue}
    stepSize={0.1}
    integral={{ xLeft: xL, xRight: xR, fillStyle: 'full' }}
  />

  {#each rects as rect, index (index)}
    <Parallelogram2D points={rect.points} color={PrimeColor.orange} fillStyle="dashed" />
  {/each}

  {#each rects as rect, index (index)}
    <Point2D
      position={rect.samplePosition}
      color={PrimeColor.orange}
      radius={0.06}
      text={`${round(rect.height, 2)}`}
      showTextOnlyOnHover={true}
      fontSize={0.5}
      offset={Math.max(rect.points[0].y, rect.points[1].y) > 0
        ? new Vector2(0, 0.3)
        : new Vector2(0, -0.1)}
    />
  {/each}

  {#each sampledPoints as point, index (index)}
    <Point2D
      position={point}
      color={PrimeColor.black}
      radius={0.05}
      text={`x_{${index + 1}}^*`}
      fontSize={0.4}
      offset={new Vector2(0, -0.05)}
    />
  {/each}
</Canvas2D>
