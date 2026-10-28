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
  import { LegendItem } from '$lib/utils/Legend';
  import Line2D from '$lib/d3/Line2D.svelte';
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';

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
  const controls = Controls.addSlider(0, -3, 3, -1, PrimeColor.pink, {
    label: toLatexText('$\\Delta t=$'),
    valueFn: (v: number) => {
      if (v >= 0) {
        return toLatexText((2 ** v).toFixed(0));
      } else {
        return toLatexText('$\\frac{1}{' + (2 ** -v).toFixed(0) + '}$');
      }
    }
  });
  const RHS = (_t: number, y: number) => 0.7 * (1 - y / 750) * y - 20;
  // Generate discrete solutions
  // FORWARD Euler
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
  // BACKWARD Euler
  const [tNumB, yNumB] = $derived.by(() => {
    const tNum = [0];
    const yNum = [30];
    const DeltaT = 2 ** controls[0];
    const steps = 64 / DeltaT;
    for (let i = 0; i < steps; i++) {
      // Calculate the next values using simple quadratic solutions
      const A = 0.7 / 750;
      const B = 0.7;
      const C = 20;
      const alpha = -DeltaT * A;
      const beta = DeltaT * B - 1;
      const gamma = yNum[i] - DeltaT * C;
      const delta = beta ** 2 - 4 * alpha * gamma;

      const tNext = tNum[i] + DeltaT;
      const yNext = (-beta - Math.sqrt(delta)) / (2 * alpha);
      tNum.push(tNext);
      yNum.push(yNext);
    }
    return [tNum, yNum];
  });
  // TRAPEZOIDAL
  const [tNumT, yNumT] = $derived.by(() => {
    const tNum = [0];
    const yNum = [30];
    const DeltaT = 2 ** controls[0];
    const steps = 64 / DeltaT;
    for (let i = 0; i < steps; i++) {
      // Calculate the next values using simple quadratic solutions
      const A = 0.7 / 750;
      const B = 0.7;
      const C = 20;
      const alpha = -(DeltaT / 2) * A;
      const beta = (DeltaT / 2) * B - 1;
      const gamma = yNum[i] + (DeltaT / 2) * RHS(tNum[i], yNum[i]) - (DeltaT / 2) * C;
      const delta = beta ** 2 - 4 * alpha * gamma;

      const tNext = tNum[i] + DeltaT;
      const yNext = (-beta - Math.sqrt(delta)) / (2 * alpha);
      tNum.push(tNext);
      yNum.push(yNext);
    }
    return [tNum, yNum];
  });
  // EXACT solution
  const ExactSolution = (t: number) =>
    (150 *
      (95 +
        Math.sqrt(9345) +
        (-95 + Math.sqrt(9345)) * Math.exp((1 / 10) * Math.sqrt(623 / 15) * t))) /
    (483 +
      5 * Math.sqrt(9345) +
      (-483 + 5 * Math.sqrt(9345)) * Math.exp((1 / 10) * Math.sqrt(623 / 15) * t));

  const legendApprox = new LegendItem(
    toLatexText('Forward Euler method'),
    PrimeColor.orange,
    'circle',
    'dashed'
  );

  const legendApproxB = new LegendItem(
    toLatexText('Backward Euler method'),
    PrimeColor.darkGreen,
    'circle',
    'dashed'
  );
  const legendApproxT = new LegendItem(
    toLatexText('Trapezoidal method'),
    PrimeColor.pink,
    'circle',
    'dashed'
  );
  const legendTime = new LegendItem(toLatexText('$t=15$'), PrimeColor.raspberry, 'square');

  const appletObjects: AppletObject[] = [
    new FunctionFragment(ExactSolution, PrimeColor.darkBlue, {
      domain: {
        xMin: 0,
        xMax: 64
      },
      width: 0.08,
      legendText: toLatexText('Exact solution'),
      shape: 'square'
    })
  ];
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  legendItems={[
    ...getLegend(appletObjects),
    legendApprox,
    legendApproxB,
    legendApproxT,
    legendTime
  ]}
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
        width={0.1}
      />
      <Line2D
        start={new Vector2(tNumB[i], yNumB[i])}
        end={new Vector2(tNumB[i - 1], yNumB[i - 1])}
        color={PrimeColor.darkGreen}
        isDashed={true}
        width={0.1}
      />
      <Line2D
        start={new Vector2(tNumT[i], yNumT[i])}
        end={new Vector2(tNumT[i - 1], yNumT[i - 1])}
        color={PrimeColor.pink}
        isDashed={true}
        width={0.1}
      />
    {/if}
  {/each}
  <TemplateComponent objects={appletObjects} />
  <InfiniteLine2D
    origin={new Vector2(15, 0)}
    direction={new Vector2(0, 1)}
    color={PrimeColor.raspberry}
    width={0.08}
  />
</Canvas2D>
