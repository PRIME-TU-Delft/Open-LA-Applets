<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Point } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';

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

  const Function = (x: number) => 2 * x ** 3 + 3 * x ** 2 - 12 * x - 5;
  const a = -4;
  const b = 2;
  const c = -2;
  const d = 1;

  // ###############
  // CAMERA SETTINGS
  // ###############
  // choose one or none of the options below - if both are specified, view box will be used

  // (remove if unnecessary)
  cameraPosition = new Vector2(1, -10);
  cameraZoom = 1.2;

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
  let scaleY = 1 / 10;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new FunctionFragment(Function, PrimeColor.blue, {
      domain: { xMin: a, xMax: b },
      width: 0.08
    }),
    new Point(new Vector2(a, Function(a)), PrimeColor.orange, {
      shape: 'circle',
      legendText: '\\text{global minimum}',
      radius: 0.23
    }),
    new Point(new Vector2(c, Function(c)), PrimeColor.green, {
      shape: 'triangle',
      legendText: '\\text{global maximum}',
      radius: 0.24
    }),
    new Point(new Vector2(c, Function(c)), PrimeColor.yellow, {
      shape: 'triangle',
      legendText: '\\text{local maximum}',
      radius: 0.15
    }),
    new Point(new Vector2(d, Function(d)), PrimeColor.raspberry, {
      shape: 'square',
      legendText: '\\text{local minimum}',
      radius: 0.15
    }),
    new Point(new Vector2(a, Function(a)), PrimeColor.cyan, {
      shape: 'circle',
      legendText: '\\text{left endpoint}',
      radius: 0.15
    }),
    new Point(new Vector2(b, Function(b)), PrimeColor.pink, {
      shape: 'diamond',
      legendText: '\\text{right endpoint}',
      radius: 0.15
    })
  ];
</script>

<Canvas2D
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
