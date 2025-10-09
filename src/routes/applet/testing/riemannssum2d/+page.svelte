<!--
 TODO:
 - riemann mode selection (dropdown?)
 - logarithmic slider (should we have?) for numRectangles
-->

<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import Rect2D from '$lib/d3/Rect2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { integrate, round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const methods = ['left', 'right', 'middle', 'random', 'min', 'max'];

  const controls = Controls.addDropdown('', methods, PrimeColor.yellow)
    .addSlider(0, -2, 3, 0.1, PrimeColor.raspberry) // b
    .addSlider(10, 1, 50, 1, PrimeColor.blue); // numRectangles

  const a = 1;

  const func = (x: number) => Math.cos((2 * Math.PI * x) / 4);
  const func_display = '\\int_{\\$1}^{\\$2} (\\cos(\\frac{2\\pi x}{4})) dx~~=~~\\$3';

  const formulas = $derived.by(() => {
    const b = round(controls[1]);
    const numRectangles = round(controls[2]);
    const dx = (b - a) / numRectangles;
    const result = integrate(func, a, b);

    const f1 = new Formula(func_display)
      .addAutoParam(a, PrimeColor.darkGreen)
      .addAutoParam(b, PrimeColor.raspberry)
      .addAutoParam(result.toFixed(3), PrimeColor.blue);

    const riemannSum = rects.reduce((sum, rect) => sum + rect.height * dx, 0);
    const riemann_display = '\\sum_{i=1}^{n} f(x_i^*) \\Delta x~~=~~\\$1,~~n=\\$2,~~\\Delta x=\\$3';

    const f2 = new Formula(riemann_display)
      .addAutoParam(riemannSum.toFixed(3), PrimeColor.orange)
      .addAutoParam(numRectangles, PrimeColor.blue)
      .addAutoParam(round(dx, 4), PrimeColor.raspberry);

    return new Formulas(f1, f2);
  });

  const method = $derived(controls[0]);
  const showHeights = true;

  const rects = $derived.by(() => {
    const b = controls[1];
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
        x = func(a + i * dx) < func(a + (i + 1) * dx) ? a + i * dx : a + (i + 1) * dx;
      } else if (method === 'max') {
        x = func(a + i * dx) > func(a + (i + 1) * dx) ? a + i * dx : a + (i + 1) * dx;
      } else {
        x = a + i * dx; // fallback to left method
      }
      const x1 = a + i * dx;
      const x2 = x1 + dx;
      const y = func(x);
      newRects.push({
        points: [new Vector2(x1, Math.min(0, y)), new Vector2(x2, Math.max(0, y))] as [
          Vector2,
          Vector2
        ],
        height: y, // store the height for the label
        labelPosition: new Vector2((x1 + x2) / 2, y + 0.2) // calculate label position
      });
    }
    return newRects;
  });
</script>

<Canvas2D showAxisNumbers={true} {controls} {formulas}>
  <ParameterizedFunction2D
    xFunc={(t) => t}
    yFunc={func}
    color={PrimeColor.blue}
    tStart={-30}
    tEnd={30}
    stepSize={0.1}
  />
  <g>
    {#each rects as rect}
      <Rect2D
        points={rect.points}
        color={PrimeColor.blue + '90'}
        hoverText={`h=${round(rect.height, 2)}`}
      />
    {/each}
  </g>
</Canvas2D>
