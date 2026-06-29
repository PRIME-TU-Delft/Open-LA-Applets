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
  import { LegendItem } from '$lib/utils/Legend';
  import Point2D from '$lib/d3/Point2D.svelte';

  let initialViewBox: ViewBox | undefined;
  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;
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
  cameraPosition = new Vector2(3, 1);
  cameraZoom = 1.5;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-4, -8), // bottom-left
    new Vector2(4, 8), // top-right
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
    skipX: 1,
    skipY: 0
  };

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 2;
  let scaleY = 1;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  function generateLegendItems() {
    const b = controls[0];
    let part1 = '';
    if (b === 0) {
      part1 += '0';
    } else if (b === 1) {
      part1 += '-x^4';
    } else if (b === -1) {
      part1 += 'x^4';
    } else if (b > 0) {
      part1 += '-' + b.toFixed(0) + 'x^4';
    } else {
      part1 += (-1 * b).toFixed(0) + 'x^4';
    }
    const part2 = (b ** 2).toFixed(0);
    let part3 = '';
    if (b + 1 === 1) {
      part3 += 'x+1';
    } else if (b + 1 === -1) {
      part3 += '-x-1';
    } else if (b + 1 === 0) {
      part3 += '1';
    } else {
      part3 += (b + 1).toFixed(0) + 'x+1';
    }
    const complete =
      'f(x)=\\left\\{\\begin{array}{ll}' +
      part1 +
      ',&x<1,\\\\' +
      part2 +
      ',&x=1,\\\\' +
      part3 +
      ',&x> 1.\\end{array}\\right.';
    return [new LegendItem(complete, PrimeColor.blue)];
  }
  const controls = Controls.addSlider(1, -3, 3, 1, PrimeColor.raspberry, {
    label: toLatexText('$b$'),
    valueFn: (v: number) => v.toFixed(0),
    animationStep: 1
  });
  const legendItems = $derived(generateLegendItems());
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  {legendItems}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  legendFormulaPosition="top-left"
>
  {@const b = controls[0]}
  <ExplicitFunction2D func={(x: number) => -1 * b * x ** 4} xMax={1} color={PrimeColor.blue} />
  <ExplicitFunction2D func={(x: number) => (b + 1) * x + 1} xMin={1} color={PrimeColor.blue} />
  {#if b !== -1}
    <Point2D
      position={new Vector2(1, -1 * b * 1 ** 4)}
      color={PrimeColor.blue}
      fill={PrimeColor.white}
    />
    <Point2D
      position={new Vector2(1, (b + 1) * 1 + 1)}
      color={PrimeColor.blue}
      fill={PrimeColor.white}
    />
    <Point2D position={new Vector2(1, b ** 2)} color={PrimeColor.blue} />
  {/if}
</Canvas2D>
