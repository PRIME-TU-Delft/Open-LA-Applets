<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import Rect2D from '$lib/d3/Rect2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { integrate, round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const methods = ['middle', 'left', 'right', 'random', 'min', 'max'];

  const controls = Controls.addDropdown('', methods, PrimeColor.yellow)
    .addSlider(1, -2, 2, 0.1, PrimeColor.raspberry) // b
    .addSlider(5, 1, 10, 1, PrimeColor.blue); // numRectangles

  const func = (x: number) => Math.exp(-x) + 1;
  const func_display = '\\int_{\\$1}^{\\$2} (e^{-x} + 1) dx~~=~~\\$3';

  const formulas = $derived.by(() => {
    const a = round(1 - controls[1]);
    const b = round(1 + controls[1]);
    const numRectangles = round(controls[2]);
    const dx = (b - a) / numRectangles;
    const result = integrate(func, a, b);

    const f1 = new Formula(func_display)
      .addAutoParam(a, PrimeColor.raspberry)
      .addAutoParam(b, PrimeColor.raspberry)
      .addAutoParam(result.toFixed(3), PrimeColor.cyan);

    const riemannSum = rects.reduce((sum, rect) => sum + rect.height * dx, 0);
    const riemann_display = '\\sum_{i=1}^{n} f(x_i^*) \\Delta x~~=~~\\$1,~~n=\\$2,~~\\Delta x=\\$3';

    const f2 = new Formula(riemann_display)
      .addAutoParam(riemannSum.toFixed(3), PrimeColor.cyan)
      .addAutoParam(numRectangles, PrimeColor.blue)
      .addAutoParam(round(dx, 4), PrimeColor.raspberry);

    return new Formulas(f1, f2);
  });

  const method = $derived(controls[0]);

  const rects = $derived.by(() => {
    const a = 1 - controls[1];
    const b = 1 + controls[1];
    const numRectangles = controls[2];
    const dx = (b - a) / numRectangles;
    const newRects = [];
    for (let i = 0; i < numRectangles; i++) {
      let x: number;
      if (method === 'left') {
        x = a + i * dx;
      } else if (method === 'right') {
        x = a + (i + 1) * dx;
      } else if (method === 'middle') {
        x = a + (i + 0.5) * dx;
      } else if (method === 'random') {
        x = a + i * dx + Math.random() * dx;
      } else if (method === 'min') {
        // Find the minimum value of func in [x1, x2] by sampling
        const x1 = a + i * dx;
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
      } else if (method === 'max') {
        // Find the maximum value of func in [x1, x2] by sampling
        const x1 = a + i * dx;
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
        x = a + i * dx; // fallback to left method
      }
      const samplePosition = new Vector2(x, func(x));
      const x1 = a + i * dx;
      const x2 = x1 + dx;
      const y = func(x);
      const color =
        b > a
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
  showAxisNumbers={true}
  {controls}
  {formulas}
  cameraPosition={new Vector2(1, 1)}
  cameraZoom={1.25}
>
  <ParameterizedFunction2D
    xFunc={(t) => t}
    yFunc={func}
    color={PrimeColor.blue}
    tStart={-1}
    tEnd={3}
    stepSize={0.1}
  />
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
