<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import FillBetweenFunctions2D from '$lib/d3/FillBetweenFunctions2D.svelte';

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
  cameraPosition = new Vector2(5, 0);
  cameraZoom = 0.9;

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: false,
    showAxisNumbersY: false,
    logarithmicX: false,
    logarithmicY: false,
    skipX: -1,
    skipY: -1
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
  const a = 1;
  const b = 5;
  function FunctionF(x: number): number {
    return -1.5 - Math.sin(x);
  }
  function FunctionG(x: number): number {
    return 1.2 * Math.cos(0.5 * x);
  }
  function DerivativeF(x: number): number {
    return -1 * Math.cos(x);
  }
  function DerivativeG(x: number): number {
    return -0.6 * Math.sin(0.5 * x);
  }
  function Left(x: number): number {
    return FunctionF(x) * DerivativeG(x);
  }
  function Right(x: number): number {
    return DerivativeF(x) * FunctionG(x);
  }
  function Middle(x: number): number {
    return Left(x) + Right(x);
  }
  const appletObjects: AppletObject[] = [
    new FunctionFragment(Left, PrimeColor.blue, {
      legendText: "f(x)g'(x)",
      width: 0.05
    })
  ];
  const appletObjects2: AppletObject[] = [
    new FunctionFragment(Middle, PrimeColor.raspberry, {
      legendText: "(f(x)g(x))'",
      width: 0.05
    })
  ];
  const appletObjects3: AppletObject[] = [
    new FunctionFragment(Right, PrimeColor.darkGreen, {
      legendText: "f'(x)g(x)",
      width: 0.05
    })
  ];
  const draggables = [
    new Draggable(new Vector2(a, 0), PrimeColor.yellow, 'a', snapTop, undefined, 'bottom', 0.08),
    new Draggable(new Vector2(b, 0), PrimeColor.purple, 'b', snapTop, undefined, 'bottom', 0.08)
  ];
  function snapTop(position: Vector2): Vector2 {
    const x = position.x;
    return new Vector2(x, 0);
  }
</script>

<CanvasGrid
  rows={3}
  columns={1}
  legendItems={[
    ...getLegend(appletObjects),
    ...getLegend(appletObjects2),
    ...getLegend(appletObjects3)
  ]}
  legendFormulaPosition="top-right"
>
  <GridCanvas2D
    {draggables}
    gridColumn="1"
    gridRow="1"
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <ExplicitFunction2D
      func={Left}
      color={PrimeColor.blue}
      width={0.05}
      integral={{
        xLeft: draggables[0].position.x,
        xRight: draggables[1].position.x,
        fillStyle: 'full'
      }}
    />
  </GridCanvas2D>

  <GridCanvas2D
    {draggables}
    gridColumn="1"
    gridRow="2"
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <ExplicitFunction2D
      func={Left}
      color={PrimeColor.blue}
      width={0.05}
      xMin={0}
      xMax={0}
      integral={{
        xLeft: draggables[0].position.x,
        xRight: draggables[1].position.x,
        fillStyle: 'full'
      }}
    />
    <ExplicitFunction2D func={Middle} color={PrimeColor.raspberry} width={0.05} />
    <FillBetweenFunctions2D
      func1={Left}
      func2={Middle}
      color1={PrimeColor.blue}
      color2={PrimeColor.raspberry}
      width={0.05}
      xMin={0}
      xMax={0}
      integral={{
        xLeft: draggables[0].position.x,
        xRight: draggables[1].position.x,
        fillStyle: 'dashed',
        color: PrimeColor.darkGreen
      }}
    />
  </GridCanvas2D>

  <GridCanvas2D
    {draggables}
    gridColumn="1"
    gridRow="3"
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <!-- <TemplateComponent objects={appletObjects3} /> -->
    <ExplicitFunction2D
      func={Right}
      color={PrimeColor.darkGreen}
      width={0.05}
      integral={{
        xLeft: draggables[0].position.x,
        xRight: draggables[1].position.x,
        fillStyle: 'dashed'
      }}
    />
  </GridCanvas2D>
</CanvasGrid>
