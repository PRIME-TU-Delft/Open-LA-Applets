<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import VectorField2D from '$lib/d3/VectorField2D.svelte';

  let initialViewBox: ViewBox | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;
  let axis: AxisProps | undefined;

  // ########################
  // TUTORIAL / DOCUMENTATION
  // ########################
  // https://docs.openla.ewi.tudelft.nl/?path=/docs/tutorials-tutorial-template--docs
  // on this page you can find documentation for the template objects and a tutorial on using them

  // ###############
  // CAMERA SETTINGS
  // ###############
  // choose one or none of the options below - if both are specified, view box will be used
  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-6, -4), // bottom-left
    new Vector2(10, 10), // top-right
    0.5 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: 0,
    skipY: 0
  };

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 1;
  let scaleY = 1;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 't';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  function Solution(t: number, Q: number, k: number, M: number): number {
    if (Q === M || Q === 0) {
      return Q;
    }
    return (M * Q) / (Q + (M - Q) * Math.exp(-k * t));
  }
  const controls = Controls.addSlider(0.2, 0, 10, 0.1, PrimeColor.raspberry, {
    label: toLatexText('$P(0)=$'),
    valueFn: (v: number) => toLatexText('$' + v.toFixed(1).replace('.0', '') + '$')
  })
    .addSlider(2, 0, 10, 0.1, PrimeColor.darkGreen, {
      label: toLatexText('$k=$'),
      valueFn: (v: number) => toLatexText('$' + v.toFixed(1).replace('.0', '') + '$')
    })
    .addSlider(5, 0.1, 10, 0.1, PrimeColor.orange, {
      label: toLatexText('$M=$'),
      valueFn: (v: number) => toLatexText('$' + v.toFixed(1).replace('.0', '') + '$')
    });
  const formulas = $derived.by(() => {
    const f1 = new Formula('\\frac{dP}{dt} = \\$1\\cdot \\$2\\left(1-\\frac{P}{\\$2}\\right)')
      .addAutoParam(controls[1].toFixed(1).replace('.0', ''), PrimeColor.darkGreen)
      .addAutoParam(controls[2].toFixed(1).replace('.0', ''), PrimeColor.orange);
    return [f1];
  });
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  {formulas}
  showFormulasDefault
  legendFormulaPosition="top-left"
>
  {@const k = controls[1]}
  {@const M = controls[2]}
  {@const fy = (y: number) => k * y * (1 - y / M)}
  <VectorField2D
    f={(_x: number, y: number) => new Vector2(1, fy(y))}
    color={PrimeColor.black}
    yRange={[0, 30]}
  />

  <ExplicitFunction2D
    func={(t: number) => Solution(t, controls[0], controls[1], controls[2])}
    color={PrimeColor.blue}
    width={0.08}
    xMin={0}
  />
  <Point2D
    position={new Vector2(0, Solution(0, controls[0], controls[1], controls[2]))}
    color={PrimeColor.raspberry}
  />
</Canvas2D>
