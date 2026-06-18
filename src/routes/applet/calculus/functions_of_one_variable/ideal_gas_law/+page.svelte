<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { LegendItem } from '$lib/utils/Legend';
  import { Formula } from '$lib/utils/Formulas';

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
  cameraPosition = new Vector2(6, 2);
  cameraZoom = 1.0;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-1, -3), // bottom-left
    new Vector2(7, 7), // top-right
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
  xAxisLabel = 'V (\\text{m}^3)';
  yAxisLabel = 'P (\\text{kPa})';

  // ##############
  // APPLET OBJECTS
  // ##############
  const controls = Controls.addSlider(1, 1, 10, 1, PrimeColor.darkGreen, {
    label: toLatexText('$n$ (mol)'),
    valueFn: (v: number) => v.toFixed(0),
    animationStep: 1
  }).addSlider(20, -273, 273, 1, PrimeColor.orange, {
    label: toLatexText('$T$ ($^{\\circ}$C)'),
    valueFn: (v: number) => v.toFixed(0),
    animationStep: 1
  });

  function idealGasLaw(V: number): number {
    const n = controls[0]; // moles
    const R = 8.31446261815324; // L·atm/(K·mol)
    const T = controls[1] + 273.15; // K
    return ((n * R * T) / V) * 10 ** -3;
  }
  const appletObjects: AppletObject[] = [
    new FunctionFragment(idealGasLaw, PrimeColor.blue, { domain: { xMin: 0 } })
  ];

  function textFormula() {
    const n = controls[0];
    const T = controls[1];
    let value = `P(V)=\\frac{${n} \\cdot R \\cdot ${(T + 273.15).toFixed(2)}}{V}`;
    return value;
  }

  const legendItems = $derived([new LegendItem(textFormula(), PrimeColor.blue)]);

  const formula = [
    new Formula('R\\approx8.31446\\,\\,\\frac{\\text{Pa}}{\\text{K} \\cdot \\text{mol}}')
  ];
</script>

<Canvas2D
  {controls}
  // {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  {legendItems}
  formulas={formula}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
