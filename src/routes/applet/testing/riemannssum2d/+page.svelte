<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { integrate, round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import Rect2D from '$lib/d3/Rect2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { Vector2 } from 'three';

  const controls = Controls
      .addSlider(-1, -4, 0, 0.1, PrimeColor.darkGreen) // b
      .addSlider(1, 0, 4, 0.1, PrimeColor.raspberry); // a
      
  const func = (x: number) => Math.cos((2 * Math.PI * x) / 4);
  const func_display = '\\int_{\\$1}^{\\$2} (\\cos(\\frac{2\\pi x}{4})) dx~~=~~\\$3';

  const formulas = $derived.by(() => {
    const a = round(controls[0]);
    const b = round(controls[1]);
    const result = integrate(func, a, b);

    const f1 = new Formula(func_display)
      .addAutoParam(a, PrimeColor.darkGreen)
      .addAutoParam(b, PrimeColor.raspberry)
      .addAutoParam(result, PrimeColor.blue);

    return new Formulas(f1);
  });

  const numRectangles = 10; // Number of rectangles for the Riemann sum
  let method: 'left' | 'right' | 'middle' | 'random' = 'random';
  const showHeights = true;

  const rects = $derived.by(() => {
    const a = controls[0];
    const b = controls[1];
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
      } else {
        x = a + i * dx; // fallback to left method
      }
      const x1 = a + i * dx;
      const x2 = x1 + dx;
      const y = func(x);
      newRects.push({
        points: [
          new Vector2(x1, Math.min(0, y)),
          new Vector2(x2, Math.max(0, y))
        ] as [Vector2, Vector2],
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
    color="blue"
    tStart={-10}
    tEnd={10}
    stepSize={0.1}
  />
  <g>
    {#each rects as rect}
      <Rect2D points={rect.points} color={"rgba(0, 0, 255, 0.5)"} />
      {#if showHeights}
        <Latex2D
          latex={`h=${round(rect.height, 2)}`}
          fontSize={0.5}
          position={rect.labelPosition}
          offset={new Vector2(0, rect.labelPosition.y > 0 ? 0.2 : -0.2)}
          color="black"
        />
      {/if}
    {/each}
  </g>
</Canvas2D>
