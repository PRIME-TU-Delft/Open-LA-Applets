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

  let cameraPosition: Vector2 | undefined;
  let cameraPosition2: Vector2 | undefined;
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
  cameraPosition = new Vector2(2.5, 0.5);
  cameraPosition2 = new Vector2(2.5, 0);
  cameraZoom = 2.5;

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
    return Math.exp(-2 * x) * Math.cos(3 * x);
  }
  function Antiderivative(x: number): number {
    return (Math.exp(-2 * x) * (3 * Math.sin(3 * x) - 2 * Math.cos(3 * x))) / 13;
  }
  const appletObjects: AppletObject[] = [
    new FunctionFragment(Function, PrimeColor.blue, { legendText: 'e^{-2x}\\cos(3x)', width: 0.05 })
  ];
  const appletObjects2: AppletObject[] = [
    new FunctionFragment(Antiderivative, PrimeColor.raspberry, {
      legendText: '-\\frac{2}{13}e^{-2x}\\cos(3x)+\\frac{3}{13}e^{-2x}\\sin(3x)',
      width: 0.05
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
      0.08
    ),
    new Draggable(
      new Vector2(initX, Antiderivative(initX)),
      PrimeColor.yellow,
      undefined,
      snapBottom,
      undefined,
      undefined,
      0.08
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
  const DeltaX = 0.5;
</script>

<CanvasGrid
  rows={2}
  columns={1}
  legendItems={[...getLegend(appletObjects), ...getLegend(appletObjects2)]}
  legendFormulaPosition="top-right"
>
  <GridCanvas2D
    draggables={[draggablePoints[0]]}
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects} />
  </GridCanvas2D>

  <GridCanvas2D
    draggables={[draggablePoints[1]]}
    cameraPosition={cameraPosition2}
    {cameraZoom}
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
      width={0.08}
      color={PrimeColor.yellow}
    />
  </GridCanvas2D>
</CanvasGrid>
