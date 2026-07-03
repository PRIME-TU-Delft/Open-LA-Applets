<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
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

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-2, -1), // bottom-left
    new Vector2(2, 5), // top-right
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
  let scaleX = 2;
  let scaleY = 2;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const Function = (x: number) => 5 * Math.pow(31 + x ** 2, 1 / 5) - 8;
  const Derivative = (x: number) => 5 * (((1 / 5) * (2 * x)) / Math.pow(31 + x ** 2, 4 / 5));
  const TangentLine = (x: number, a: number) => Function(a) + Derivative(a) * (x - a);

  function snapToFuncA(point: Vector2): Vector2 {
    const x = Math.max(0, point.x);
    return new Vector2(x, Function(x));
  }
  function snapToFuncB(point: Vector2): Vector2 {
    const x = Math.min(0, point.x);
    return new Vector2(x, Function(x));
  }

  const draggablePoints = [
    new Draggable(
      new Vector2(1, Function(1)),
      PrimeColor.raspberry,
      undefined,
      snapToFuncA,
      undefined,
      undefined,
      0.15
    ),
    new Draggable(
      new Vector2(-1, Function(-1)),
      PrimeColor.orange,
      undefined,
      snapToFuncB,
      undefined,
      undefined,
      0.15
    )
  ];

  const appletObjects: AppletObject[] = [
    new FunctionFragment(Function, PrimeColor.blue, {
      legendText: 'f(x)=5\\sqrt[5]{31+x^2}-8',
      width: 0.1
    })
  ];
</script>

<Canvas2D
  draggables={draggablePoints}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={[...getLegend(appletObjects)]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
  <InfiniteLine2D
    origin={draggablePoints[1].position}
    direction={new Vector2(1, Derivative(draggablePoints[1].position.x))}
    color={PrimeColor.orange}
    width={0.1}
  />
  <InfiniteLine2D
    origin={draggablePoints[0].position}
    direction={new Vector2(1, Derivative(draggablePoints[0].position.x))}
    color={PrimeColor.raspberry}
    width={0.1}
  />
</Canvas2D>
