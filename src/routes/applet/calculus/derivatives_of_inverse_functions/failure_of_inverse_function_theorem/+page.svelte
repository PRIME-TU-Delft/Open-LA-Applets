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
  import Line2D from '$lib/d3/Line2D.svelte';

  let initialViewBox: ViewBox | undefined;
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
  initialViewBox = new ViewBox(
    new Vector2(-3, -3), // bottom-left
    new Vector2(5, 5), // top-right
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
  const Function = (x: number) => (x - 1) ** 3;
  const InverseFunction = (x: number) => Math.cbrt(x) + 1;
  const Derivative = (x: number) => 3 * (x - 1) ** 2;

  const appletObjects: AppletObject[] = [
    new FunctionFragment(Function, PrimeColor.blue, {
      legendText: 'f(x)=(x-1)^3'
    }),
    new FunctionFragment(InverseFunction, PrimeColor.darkGreen, {
      legendText: 'f^{-1}(x)=\\sqrt[3]{x}+1'
    }),
    new FunctionFragment('x', PrimeColor.grey, {
      legendText: 'y=x',
      isDashed: true
    })
  ];

  let masterX = $state(1);

  function snapToFuncA(point: Vector2): Vector2 {
    masterX = point.x;
    return new Vector2(point.x, Function(point.x));
  }
  function snapToFuncB(point: Vector2): Vector2 {
    masterX = InverseFunction(point.x);
    return new Vector2(point.x, InverseFunction(point.x));
  }

  const draggablePoints = [
    new Draggable(
      new Vector2(1, Function(1)),
      PrimeColor.raspberry,
      undefined,
      snapToFuncA,
      undefined,
      undefined
      // 0.15
    ),
    new Draggable(
      new Vector2(Function(1), 1),
      PrimeColor.orange,
      undefined,
      snapToFuncB,
      undefined,
      undefined
      // 0.15
    )
  ];

  $effect(() => {
    const x = masterX;
    draggablePoints[0].value = new Vector2(x, Function(x));
    draggablePoints[1].value = new Vector2(Function(x), x);
  });
</script>

<Canvas2D
  draggables={draggablePoints}
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  legendFormulaPosition="top-left"
>
  <TemplateComponent objects={appletObjects} />
  <Line2D
    start={draggablePoints[0].position}
    end={draggablePoints[1].position}
    color={PrimeColor.grey}
    isDashed={true}
  />
  <InfiniteLine2D
    origin={draggablePoints[0].position}
    direction={new Vector2(1, Derivative(draggablePoints[0].position.x))}
    color={PrimeColor.raspberry}
  />
  <InfiniteLine2D
    origin={draggablePoints[1].position}
    direction={new Vector2(Derivative(draggablePoints[0].position.x), 1)}
    color={PrimeColor.orange}
  />
</Canvas2D>
