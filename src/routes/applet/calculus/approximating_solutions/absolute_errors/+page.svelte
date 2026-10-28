<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { LegendItem } from '$lib/utils/Legend';
  import { Formula } from '$lib/utils/Formulas';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';

  let initialViewBox: ViewBox | undefined;
  let xAxisLabel: string | undefined;
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
    new Vector2(-7.1, -6.1), // bottom-left
    new Vector2(6.1, 4.1), // top-right
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
    logarithmicX: true,
    logarithmicY: true,
    skipX: 1,
    skipY: 1
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
  xAxisLabel = '\\Delta t';

  // ##############
  // APPLET OBJECTS
  // ##############
  const controls = Controls.addSlider(15, 0, 60, -1, PrimeColor.raspberry, {
    label: toLatexText('$t=$'),
    valueFn: (v: number) => toLatexText(v.toFixed(0))
  });
  const RHS = (_t: number, y: number) => 0.7 * (1 - y / 750) * y - 20;
  // EXACT solution
  const ExactSolution = (t: number) =>
    (150 *
      (95 +
        Math.sqrt(9345) +
        (-95 + Math.sqrt(9345)) * Math.exp((1 / 10) * Math.sqrt(623 / 15) * t))) /
    (483 +
      5 * Math.sqrt(9345) +
      (-483 + 5 * Math.sqrt(9345)) * Math.exp((1 / 10) * Math.sqrt(623 / 15) * t));
  // Generate discrete errors for several Dt
  const DeltaTArray = Array.from({ length: 12 }, (_, n) => 1 / 2 ** n);
  // FORWARD Euler
  const Errors = $derived.by(() => {
    const tEnd = controls[0];
    const Errors = [];
    for (const DeltaT of DeltaTArray) {
      const tNum = [0];
      const yNum = [30];
      const steps = tEnd / DeltaT;
      for (let i = 0; i < steps; i++) {
        const tNext = tNum[i] + DeltaT;
        const yNext = yNum[i] + DeltaT * RHS(tNum[i], yNum[i]);
        tNum.push(tNext);
        yNum.push(yNext);
      }
      const err = Math.abs(ExactSolution(tEnd) - yNum[yNum.length - 1]);
      Errors.push(err);
    }
    return Errors;
  });
  // BACKWARD Euler
  const ErrorsB = $derived.by(() => {
    const tEnd = controls[0];
    const Errors = [];
    for (const DeltaT of DeltaTArray) {
      const tNum = [0];
      const yNum = [30];
      const steps = tEnd / DeltaT;
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
      const err = Math.abs(ExactSolution(tEnd) - yNum[yNum.length - 1]);
      Errors.push(err);
    }
    return Errors;
  });
  // TRAPEZOIDAL
  const ErrorsT = $derived.by(() => {
    const tEnd = controls[0];
    const Errors = [];
    for (const DeltaT of DeltaTArray) {
      const tNum = [0];
      const yNum = [30];
      const steps = tEnd / DeltaT;
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
      const err = Math.abs(ExactSolution(tEnd) - yNum[yNum.length - 1]);
      Errors.push(err);
    }
    return Errors;
  });

  const legendApprox = new LegendItem(
    toLatexText('Forward Euler method'),
    PrimeColor.orange,
    'circle',
    'dashed'
  );
  const legendApproxB = new LegendItem(
    toLatexText('Backward Euler method'),
    PrimeColor.darkGreen,
    'square',
    'dashed'
  );
  const legendApproxT = new LegendItem(
    toLatexText('Trapezoidal method'),
    PrimeColor.pink,
    'triangle',
    'dashed'
  );
  const formulaN = $derived(
    new Formula(toLatexText('$N=\\dfrac{\\$1}{\\Delta t}$')).addAutoParam(
      controls[0],
      PrimeColor.raspberry
    )
  );

  const yAxisLabel = $derived(
    new Formula('|y(\\$1)-\\tilde{y}_N|').addAutoParam(controls[0], PrimeColor.raspberry)
  );
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  formulas={[formulaN]}
  legendItems={[legendApprox, legendApproxB, legendApproxT]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  legendFormulaPosition="top-left"
>
  {#each DeltaTArray as Dt, i (i)}
    {#if i > 0}
      <Line2D
        start={new Vector2(Math.log10(DeltaTArray[i - 1]), Math.log10(Errors[i - 1]))}
        end={new Vector2(Math.log10(Dt), Math.log10(Errors[i]))}
        color={PrimeColor.orange}
        isDashed={true}
        width={0.05}
      />
      <Line2D
        start={new Vector2(Math.log10(DeltaTArray[i - 1]), Math.log10(ErrorsB[i - 1]))}
        end={new Vector2(Math.log10(Dt), Math.log10(ErrorsB[i]))}
        color={PrimeColor.darkGreen}
        isDashed={true}
        width={0.05}
      />
      <Line2D
        start={new Vector2(Math.log10(DeltaTArray[i - 1]), Math.log10(ErrorsT[i - 1]))}
        end={new Vector2(Math.log10(Dt), Math.log10(ErrorsT[i]))}
        color={PrimeColor.pink}
        isDashed={true}
        width={0.05}
      />
    {/if}
    <Point2D
      position={new Vector2(Math.log10(Dt), Math.log10(Errors[i]))}
      color={PrimeColor.orange}
    />
    <Point2D
      position={new Vector2(Math.log10(Dt), Math.log10(ErrorsB[i]))}
      color={PrimeColor.darkGreen}
      shape="square"
    />
    <Point2D
      position={new Vector2(Math.log10(Dt), Math.log10(ErrorsT[i]))}
      color={PrimeColor.pink}
      shape="triangle"
    />
  {/each}
</Canvas2D>
