<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import VectorField2D from '$lib/d3/VectorField2D.svelte';
  import { Controls } from '$lib/controls/Controls';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';
  import Line2D from '$lib/d3/Line2D.svelte';

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
  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-2, 0), // bottom-left
    new Vector2(3, 1.5), // top-right
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
  let scaleX = 2;
  let scaleY = 2;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 't';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const controls = Controls.addSlider(2, 0, 5, 1, PrimeColor.pink, {
    label: toLatexText('Number of steps'),
    valueFn: (v: number) => toLatexText(v.toFixed(0))
  });
  const RHS = (t: number, y: number) => (-1 / 5) * t * y ** 2;
  const ExactSolution = (t: number) => 10 / (6 + t ** 2);

  // Generate discrete solutions
  let tNum = [-2];
  let yNum = [1];
  const DeltaT = 1;
  const tol = 1e-6;
  const maxIter = 100;
  for (let i = 0; i < 5; i++) {
    const tNext = tNum[i] + DeltaT;
    let yGuess = yNum[i];
    let yNext = yNum[i] + (DeltaT / 2) * (RHS(tNum[i], yNum[i]) + RHS(tNext, yGuess));
    let iter = 0;
    let err = Math.abs(yGuess - yNext);
    while (err > tol && iter < maxIter) {
      iter++;
      yGuess = yNext;
      yNext = yNum[i] + (DeltaT / 2) * (RHS(tNum[i], yNum[i]) + RHS(tNext, yGuess));
      err = Math.abs(yGuess - yNext);
    }
    tNum.push(tNext);
    yNum.push(yNext);
  }

  const N = $derived(controls[0]);
  const appletObjects: AppletObject[] = [
    new FunctionFragment(ExactSolution, PrimeColor.darkGreen, {
      domain: {
        xMin: -2,
        xMax: 3
      },
      width: 0.08,
      legendText: toLatexText('Exact solution'),
      shape: 'square'
    })
  ];

  const legendApprox = new LegendItem(
    toLatexText('Trapezoidal method'),
    PrimeColor.orange,
    'circle'
  );
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  legendItems={[...getLegend(appletObjects), legendApprox]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <VectorField2D
    f={(t: number, y: number) => new Vector2(1, RHS(t, y))}
    color={PrimeColor.blue + PrimeColor.opacity(0.5)}
    normalizedLength={0.2}
    step={0.25}
    hideHead={true}
    xRange={[-4, 5]}
    yRange={[-2, 3.5]}
  />
  <TemplateComponent objects={appletObjects} />
  {#each new Array(N + 1) as _, i (i)}
    {#if i > 0}
      <Line2D
        start={new Vector2(tNum[i], yNum[i])}
        end={new Vector2(tNum[i - 1], yNum[i - 1])}
        color={PrimeColor.orange}
        isDashed={true}
        width={0.08}
      />
    {/if}
    <Point2D position={new Vector2(tNum[i], yNum[i])} color={PrimeColor.orange} radius={0.12} />
  {/each}
</Canvas2D>
