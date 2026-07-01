<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { toLatexText, withSign } from '$lib/utils/FormatString';
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
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const legendItems = $derived.by(() => {
    const b = controls[0];
    const Dollar1 = b != 0 ? '$1' : '';
    return [
      new LegendItem(
        'f(x)=\\left\\{\\begin{array}{ll}2^x\\' +
          Dollar1 +
          ',&x<2,\\\\\\$2,&x=2,\\\\x^2-3x,&x> 2.\\end{array}\\right.',
        PrimeColor.blue
      )
        .addAutoParam(withSign(b, 1).replace('.0', ''), PrimeColor.raspberry)
        .addAutoParam((2 * b + 10).toFixed(1).replace('.0', ''), PrimeColor.raspberry)
    ];
  });

  const controls = Controls.addSlider(-2, -10, 10, 0.5, PrimeColor.raspberry, {
    label: toLatexText('$b$'),
    valueFn: (v: number) => v.toFixed(1).replace('.0', ''),
    animationStep: 0.5
  });
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
  <ExplicitFunction2D func={(x: number) => 2 ** x + b} xMax={2} color={PrimeColor.blue} />
  <ExplicitFunction2D func={(x: number) => x ** 2 - 3 * x} xMin={2} color={PrimeColor.blue} />
  {#if b !== -6}
    <Point2D
      position={new Vector2(2, 2 ** 2 + b)}
      color={PrimeColor.blue}
      fill={PrimeColor.white}
    />
    <Point2D
      position={new Vector2(2, 2 ** 2 - 3 * 2)}
      color={PrimeColor.blue}
      fill={PrimeColor.white}
    />
    <Point2D position={new Vector2(2, 2 * b + 10)} color={PrimeColor.blue} />
  {/if}
</Canvas2D>
