<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Rect2D from '$lib/d3/Rect2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { round, roundString } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';

  const methods = [
    'applets.calculus.riemann_sum.middle',
    'applets.calculus.riemann_sum.left',
    'applets.calculus.riemann_sum.right',
    'applets.calculus.riemann_sum.random',
    'applets.calculus.riemann_sum.min',
    'applets.calculus.riemann_sum.max'
  ];

  const controls = Controls.addDropdown('', methods, PrimeColor.yellow).addSlider(
    5,
    1,
    10,
    1,
    PrimeColor.blue,
    { label: 'n', valueFn: (v) => roundString(v, 0) }
  );

  const currentMethod = $derived(
    controls[0].replace('applets.calculus.riemann_sum.', '').toLowerCase()
  );

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

  let func = (x: number) => {
    return 4 / Math.sqrt(x + 1);
  };
  let intFunc = (x: number) => {
    return 8 * Math.sqrt(x + 1);
  };

  const func_display = '\\int_{\\$1}^{\\$2} f(x) \\, dx = \\$3';

  const formulas = $derived.by(() => {
    const numRectangles = round(controls[1]);
    const dx = (xR - xL) / numRectangles;
    const integralResult = intFunc(xR) - intFunc(xL);

    const f1 = new Formula(func_display)
      .addAutoParam(round(xL), PrimeColor.orange)
      .addAutoParam(round(xR), PrimeColor.orange)
      .addAutoParam(round(integralResult, 7), PrimeColor.cyan);

    const riemannSum = rects.reduce((sum, rect) => sum + rect.height * dx, 0);
    const riemann_display = '\\sum_{i=1}^{\\$2} f(x_i^*) \\Delta x = \\$1, ~~\\Delta x=\\$3';

    const f2 = new Formula(riemann_display)
      .addAutoParam(round(riemannSum, 7), PrimeColor.cyan)
      .addAutoParam(numRectangles, PrimeColor.blue)
      .addAutoParam(round(dx, 4), PrimeColor.raspberry);

    return new Formulas(f1, f2);
  });

  const rects = $derived.by(() => {
    const numRectangles = controls[1];
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
      const color =
        xR > xL
          ? y >= 0
            ? PrimeColor.darkGreen
            : PrimeColor.raspberry
          : y < 0
            ? PrimeColor.darkGreen
            : PrimeColor.raspberry;
      newRects.push({
        points: [new Vector2(x1, Math.min(0, y)), new Vector2(x2, Math.max(0, y))] as [
          Vector2,
          Vector2
        ],
        height: y,
        samplePosition: samplePosition,
        color
      });
    }
    return newRects;
  });

  const sampledPoints = $derived.by(() => {
    return rects.map((rect) => new Vector2(rect.samplePosition.x, 0));
  });
</script>

<Canvas2D
  axis={{ showAxisNumbers: true }}
  {controls}
  {formulas}
  {draggables}
  cameraPosition={new Vector2(4, 2)}
>
  <!-- TODO: CHANGE TO NEW AXIS LABELS -->
  <Latex2D latex="x" position={new Vector2(10.5, 0.55)} />
  <Latex2D latex="f(x)" position={new Vector2(0.25, 6.25)} />

  <ExplicitFunction2D {func} color={PrimeColor.blue} stepSize={0.1} />
  <g>
    {#each rects as rect, index (index)}
      <Rect2D points={rect.points} color={rect.color + '90'} />
    {/each}
    {#each rects as rect, index (index)}
      <Point2D
        position={rect.samplePosition}
        color={PrimeColor.black}
        radius={0.04}
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
        color={PrimeColor.orange}
        radius={0.03}
        text={`T_{${index + 1}}`}
        fontSize={0.4}
        offset={new Vector2(0, -0.05)}
      />
    {/each}
  </g>
</Canvas2D>
