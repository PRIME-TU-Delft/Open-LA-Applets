<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import ImplicitFunction2D from '$lib/d3/ImplicitFunction2D.svelte';
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

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-4, -4), // bottom-left
    new Vector2(7, 4), // top-right
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
  const func = (x: number) => Math.sin(x) + Math.cos(x);
  const appletObjects: AppletObject[] = [
    new FunctionFragment(func, PrimeColor.blue, {
      domain: { xMin: -1 * Math.PI, xMax: 2 * Math.PI }
    }).addIncludedPoints([new Vector2(0, func(0)), new Vector2(2 * Math.PI, func(2 * Math.PI))])
  ];
  function snapToFunc(position: Vector2): Vector2 {
    const x = Math.min(Math.max(position.x, -1 * Math.PI), 2 * Math.PI);
    const y = func(x);
    return new Vector2(x, y);
  }
  const a = 1.5;
  const b = 3.5;
  const draggablePoint = [
    new Draggable(new Vector2(a, func(a)), PrimeColor.orange, undefined, snapToFunc),
    new Draggable(new Vector2(b, func(b)), PrimeColor.darkGreen, undefined, snapToFunc)
  ];
  const legendItems = [
    new LegendItem('f(x)', PrimeColor.blue),
    new LegendItem('(a,f(a))', PrimeColor.orange),
    new LegendItem('(b,f(b))', PrimeColor.darkGreen)
  ];
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
  ,
>
  <TemplateComponent objects={appletObjects} />
  <InfiniteLine2D
    direction={new Vector2(1, 0)}
    color={PrimeColor.orange}
    isDashed={true}
    origin={new Vector2(0, draggablePoint[0].position.y)}
  />
  <InfiniteLine2D
    direction={new Vector2(1, 0)}
    color={PrimeColor.darkGreen}
    isDashed={true}
    origin={new Vector2(0, draggablePoint[1].position.y)}
  />
  <ImplicitFunction2D
    zeroFunc={(x, y) => y - func(x)}
    color={PrimeColor.yellow}
    width={0.1}
    xMin={Math.min(draggablePoint[0].position.x, draggablePoint[1].position.x)}
    xMax={Math.max(draggablePoint[0].position.x, draggablePoint[1].position.x)}
    yMin={Math.min(draggablePoint[0].position.y, draggablePoint[1].position.y)}
    yMax={Math.max(draggablePoint[0].position.y, draggablePoint[1].position.y)}
  />
</Canvas2D>
