<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';

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
  let scaleX = 1;
  let scaleY = 1;
  initialViewBox = new ViewBox(
    new Vector2(0, 0), // bottom-left
    new Vector2(2, 4), // top-right
    0.5 // margin
  );

  // (remove if unnecessary)
  let scaleX2 = 1;
  let scaleY2 = 1;
  initialViewBox2 = new ViewBox(
    new Vector2(0, 0), // bottom-left
    new Vector2(5, 3), // top-right
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

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  function Function1(x: number): number {
    return 1 / x;
  }
  function Function2left(x: number): number {
    return x;
  }
  function Function2right(x: number): number {
    return 1;
  }
  const appletObjects1: AppletObject[] = [
    new FunctionFragment((x: number) => Function1(x), PrimeColor.blue, {
      legendText: 'f(x)=\\frac{1}{x}',
      width: 0.1,
      domain: { xMin: 0, xMax: 1 }
    }).addGaps(new Vector2(1, Function1(1)), undefined, 0.14)
  ];
  const appletObjects2: AppletObject[] = [
    new FunctionFragment((x: number) => Function2left(x), PrimeColor.raspberry, {
      legendText:
        'g(x)=\\left\\{\\begin{array}{l}x,\\qquad &\\text{if}\ 0\\leq x<2,\\\\ 1,\\qquad &\\text{if}\\ 2\\leq x\\leq 4\\end{array}\\right.',
      width: 0.08,
      domain: { xMin: 0, xMax: 2 }
    })
      .addGaps(new Vector2(2, Function2left(2)), undefined, 0.12)
      .addIncludedPoints(new Vector2(0, Function2left(0)), undefined, 0.12),
    new FunctionFragment((x: number) => Function2right(x), PrimeColor.raspberry, {
      width: 0.08,
      domain: { xMin: 2, xMax: 4 }
    }).addIncludedPoints(
      [new Vector2(2, Function2right(2)), new Vector2(4, Function2right(4))],
      undefined,
      0.12
    )
  ];
</script>

<CanvasGrid
  rows={1}
  columns={2}
  legendItems={[...getLegend(appletObjects1), ...getLegend(appletObjects2)]}
>
  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects1} />
  </GridCanvas2D>

  <GridCanvas2D
    initialViewBox={initialViewBox2}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    scaleX={scaleX2}
    scaleY={scaleY2}
  >
    <TemplateComponent objects={appletObjects2} />
  </GridCanvas2D>
</CanvasGrid>
