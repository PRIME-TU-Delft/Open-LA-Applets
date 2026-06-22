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
  import Point2D from '$lib/d3/Point2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';

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
    new Vector2(-3, -6), // bottom-left
    new Vector2(4, 7), // top-right
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
  function AbsSin(x: number): number {
    return Math.abs(x) * Math.sin(x);
  }
  function snapToFunction(position: Vector2) {
    let x = position.x;
    let y = AbsSin(x);
    return new Vector2(x, y);
  }
  const appletObjects: AppletObject[] = [
    new FunctionFragment(AbsSin, PrimeColor.blue, {
      isDashed: false,
      legendText: 'f(x)=|x|\\sin(x)'
    })
  ];

  const draggables = [
    new Draggable(new Vector2(2.5, AbsSin(2.5)), PrimeColor.orange, undefined, snapToFunction)
  ];
</script>

<Canvas2D
  {draggables}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
  <Point2D
    color={PrimeColor.yellow}
    position={new Vector2(-draggables[0].position.x, AbsSin(-draggables[0].position.x))}
    shape="square"
  />
  <Line2D
    start={new Vector2(-draggables[0].position.x, AbsSin(-draggables[0].position.x))}
    end={new Vector2(draggables[0].position.x, AbsSin(draggables[0].position.x))}
    color={PrimeColor.darkGreen}
    isDashed={true}
  />
</Canvas2D>
