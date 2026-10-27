<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
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
    new Vector2(-10, -500), // bottom-left
    new Vector2(80, 1100), // top-right
    0 // margin
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
    skipX: 1,
    skipY: 1
  };

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 1 / 5;
  let scaleY = 1 / 100;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 't';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const controls = Controls.addSlider(3, 0, 3, -1, PrimeColor.pink, {
    label: toLatexText('$\\Delta t=$'),
    valueFn: (v: number) => toLatexText((2 ** v).toFixed(0))
  });
  const RHS = (_t: number, y: number) => 0.7 * (1 - y / 750) * y - 20;
  // Generate discrete solutions
  const [tNum, yNum, steps] = $derived.by(() => {
    const tNum = [0];
    const yNum = [30];
    const DeltaT = 2 ** controls[0];
    const steps = 64 / DeltaT;
    for (let i = 0; i < steps; i++) {
      const tNext = tNum[i] + DeltaT;
      const yNext = yNum[i] + DeltaT * RHS(tNum[i], yNum[i]);
      tNum.push(tNext);
      yNum.push(yNext);
    }
    return [tNum, yNum, steps];
  });

  const legendApprox = new LegendItem(
    toLatexText('Forward Euler method'),
    PrimeColor.orange,
    'circle'
  );
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  legendItems={[legendApprox]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <VectorField2D
    f={(t: number, y: number) => new Vector2(1, RHS(t, y))}
    color={PrimeColor.blue + PrimeColor.opacity(0.5)}
    normalize={true}
    normalizedLength={35}
    step={[5, 50]}
    hideHead={true}
    xRange={[-30, 100]}
    yRange={[-500, 1200]}
  />
  {#each new Array(steps + 1) as _, i (i)}
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
