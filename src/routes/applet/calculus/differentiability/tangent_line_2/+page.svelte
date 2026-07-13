<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { LegendItem } from '$lib/utils/Legend';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';

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

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-4, -4), // bottom-left
    new Vector2(4, 9), // top-right
    0.5 // margin
  );

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  function baseFunction(x: number): number {
    return Math.pow(x, 2);
  }
  function baseDerivative(x: number): number {
    return 2 * x;
  }
  function snapToFunc(position: Vector2): Vector2 {
    const x = Number(position.x.toFixed(2)); // in increments of 0.01;
    const y = baseFunction(x);
    return new Vector2(x, y);
  }
  const initX = 1;
  const draggablePoint = [
    new Draggable(
      new Vector2(initX, baseFunction(initX)),
      PrimeColor.orange,
      undefined,
      snapToFunc,
      undefined,
      'right',
      0.15
    )
  ];
  const appletObjects: AppletObject[] = [
    new FunctionFragment(baseFunction, PrimeColor.blue, { width: 0.08 })
  ];
  function legendA() {
    const point = draggablePoint[0].position;
    return `(a,f(a))\\approx(${point.x.toFixed(2).replace(/\.00$/, '')}, ${point.y.toFixed(2).replace(/\.00$/, '')})`;
  }
  const legendItems = $derived([
    new LegendItem('f(x)=x^2', PrimeColor.blue),
    new LegendItem(legendA(), PrimeColor.orange)
  ]);
</script>

<Canvas2D
  draggables={draggablePoint}
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
  <TemplateComponent objects={appletObjects} />
  <InfiniteLine2D
    origin={draggablePoint[0].position}
    direction={new Vector2(1, baseDerivative(draggablePoint[0].position.x))}
    color={PrimeColor.darkGreen}
    width={0.08}
  />
</Canvas2D>
