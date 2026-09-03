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
  import { ViewBox } from '$lib/d3/ViewBox';

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
    new Vector2(-5, -35), // bottom-left
    new Vector2(5, 35), // top-right
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
  let scaleY = 1 / 5;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const Function = (x: number) => -2 * x ** 3 - 3 * x ** 2 + 12 * x + 3;
  const Derivative = (x: number) => -6 * x ** 2 - 6 * x + 12;
  const appletObjects: AppletObject[] = [
    new FunctionFragment(Function, PrimeColor.blue, {
      legendText: `f(x) = -2x^3 - 3x^2 + 12x + 3`,
      width: 0.08
    })
  ];
  const appletObjects2: AppletObject[] = [
    new FunctionFragment(Derivative, PrimeColor.darkGreen, {
      legendText: `f'(x) = -6x^2 - 6x + 12`,
      width: 0.08
    })
  ];

  function snapToFunc(position: Vector2): Vector2 {
    const x = Number(position.x.toFixed(1)); // in increments of 0.1;
    const y = Function(x);

    draggablePoint[1].value = new Vector2(x, Derivative(x)); // update the derivative point to match the new x-value

    return new Vector2(x, y);
  }

  function snapToDer(position: Vector2): Vector2 {
    const x = Number(position.x.toFixed(1)); // in increments of 0.1;
    const y = Derivative(x);

    draggablePoint[0].value = new Vector2(x, Function(x)); // update the derivative point to match the new x-value

    return new Vector2(x, y);
  }

  const draggablePoint = [
    new Draggable(
      new Vector2(-1, Function(-1)),
      PrimeColor.orange,
      undefined,
      snapToFunc,
      undefined,
      undefined,
      0.2
    ),
    new Draggable(
      new Vector2(-1, Derivative(-1)),
      PrimeColor.raspberry,
      undefined,
      snapToDer,
      undefined,
      undefined,
      0.2
    )
  ];
</script>

<CanvasGrid
  rows={1}
  columns={2}
  legendItems={[...getLegend(appletObjects), ...getLegend(appletObjects2)]}
  legendFormulaPosition="top-center"
>
  <GridCanvas2D
    draggables={[draggablePoint[0]]}
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects} />
  </GridCanvas2D>
  <GridCanvas2D
    draggables={[draggablePoint[1]]}
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects2} />
  </GridCanvas2D>
</CanvasGrid>
