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
  xAxisLabel = 'r (10^{11}\\,\\text{m})';
  yAxisLabel = 'F (10^{16}\\,\\text{N})';

  // ##############
  // APPLET OBJECTS
  // ##############
  const controls = Controls.addSlider(48, 46, 54, 0.5, PrimeColor.darkGreen, {
    label: toLatexText('$m_1m_2$ (kg$^2$)'),
    valueFn: (v: number) => '10^{' + v.toFixed(1).replace('.0', '') + '}',
    animationStep: 0.5
  });

  function NewtonsLawOfUniversalGravitation(r: number): number {
    const m1m2 = 10 ** controls[0]; // mass of first object times mass of second object in kg^2
    const G = 6.6743e-11; // m^3/(kg·s^2)
    return ((G * m1m2) / (r * 10 ** 11) ** 2) * 10 ** -16; // Convert r from 10^11 m to m and F from N to nN for better visualization
  }
  const appletObjects: AppletObject[] = [
    new FunctionFragment(NewtonsLawOfUniversalGravitation, PrimeColor.blue, { domain: { xMin: 0 } })
  ];

  function textFormula() {
    const m1m2 = controls[0];
    let value = `F(r)=\\frac{10^{${m1m2.toFixed(1).replace('.0', '')}}\\cdot G }{r^2}`;
    return value;
  }

  const legendItems = $derived([new LegendItem(textFormula(), PrimeColor.blue)]);

  const formula = [
    new Formula(
      'G\\approx6.67430\\times10^{-11}\\,\\,\\frac{\\text{m}^3}{\\text{kg} \\cdot \\text{s}^2}'
    )
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
