<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import { ViewBox } from '$lib/d3/ViewBox';

  let initialViewBox: ViewBox | undefined;
  let initialViewBox2: ViewBox | undefined;
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
    new Vector2(-8, -3.5), // bottom-left
    new Vector2(13, 3.5), // top-right
    0 // margin
  );
  initialViewBox2 = new ViewBox(
    new Vector2(-8, -5), // bottom-left
    new Vector2(13, 2), // top-right
    0 // margin
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
  function Function(x: number): number {
    return x * Math.cos(x);
  }
  function Antiderivative(x: number): number {
    return x * Math.sin(x) + Math.cos(x);
  }
  const appletObjects: AppletObject[] = [
    new FunctionFragment(Function, PrimeColor.blue, { legendText: 'x \\cos(x)', width: 0.1 })
  ];
  const appletObjects2: AppletObject[] = [
    new FunctionFragment(Antiderivative, PrimeColor.raspberry, {
      legendText: 'x \\sin(x) + \\cos(x)',
      width: 0.1
    })
  ];
  const initX = 1;
  const draggablePoints = [
    new Draggable(
      new Vector2(initX, Function(initX)),
      PrimeColor.yellow,
      undefined,
      snapTop,
      undefined,
      undefined,
      0.15
    ),
    new Draggable(
      new Vector2(initX, Antiderivative(initX)),
      PrimeColor.yellow,
      undefined,
      snapBottom,
      undefined,
      undefined,
      0.15
    )
  ];
  function snapTop(position: Vector2): Vector2 {
    const x = position.x;
    draggablePoints[1].value = new Vector2(x, Antiderivative(x));
    return new Vector2(x, Function(x));
  }
  function snapBottom(position: Vector2): Vector2 {
    const x = position.x;
    draggablePoints[0].value = new Vector2(x, Function(x));
    return new Vector2(x, Antiderivative(x));
  }
  const DeltaX = 0.75;
</script>

<CanvasGrid
  rows={2}
  columns={1}
  legendItems={[...getLegend(appletObjects), ...getLegend(appletObjects2)]}
  legendFormulaPosition="center-right"
>
  <GridCanvas2D
    draggables={[draggablePoints[0]]}
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects} />
  </GridCanvas2D>

  <GridCanvas2D
    draggables={[draggablePoints[1]]}
    initialViewBox={initialViewBox2}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects2} />
    <Line2D
      start={new Vector2(
        draggablePoints[1].position.x - DeltaX,
        draggablePoints[1].position.y - DeltaX * Function(draggablePoints[1].position.x)
      )}
      end={new Vector2(
        draggablePoints[1].position.x + DeltaX,
        draggablePoints[1].position.y + DeltaX * Function(draggablePoints[1].position.x)
      )}
      width={0.15}
      color={PrimeColor.yellow}
    />
  </GridCanvas2D>
</CanvasGrid>
