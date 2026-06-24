<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { LegendItem } from '$lib/utils/Legend';

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
  cameraPosition = new Vector2(2, 1);
  cameraZoom = 1.0;

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
  const controls = Controls.addSlider(2, 1, 10, 0.5, PrimeColor.blue, {
    label: toLatexText('$n$'),
    valueFn: (v: number) => v.toFixed(1),
    animationStep: 0.5
  }).addSlider(3, 1, 10, 0.5, PrimeColor.raspberry, {
    label: toLatexText('$m$'),
    valueFn: (v: number) => v.toFixed(1),
    animationStep: 0.5
  });
  function Exponential(x: number) {
    const n = controls[0];
    return n ** x;
  }
  function InverseExponential(x: number) {
    const m = controls[1];
    return (1 / m) ** x;
  }
  const appletObjects: AppletObject[] = [
    new FunctionFragment(Exponential, PrimeColor.blue),
    new FunctionFragment(InverseExponential, PrimeColor.raspberry)
  ];

  const legendItems = $derived([
    new LegendItem('A(t)=' + controls[0].toFixed(0) + '^t', PrimeColor.blue),
    new LegendItem(
      'B(t)=\\left(\\frac{1}{' + controls[1].toFixed(0) + '}\\right)^{t}',
      PrimeColor.raspberry
    )
  ]);
</script>

<Canvas2D
  {controls}
  {cameraPosition}
  {cameraZoom}
  {legendItems}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
