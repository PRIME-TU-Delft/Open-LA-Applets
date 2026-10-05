<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { ViewBox } from '$lib/d3/ViewBox';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';

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
    new Vector2(-5, -5), // bottom-left
    new Vector2(7, 11), // top-right
    2 // margin
  );
  // initialViewBox = new ViewBox(
  //   new Vector2(-9, -7), // bottom-left
  //   new Vector2(5, 9), // top-right
  //   0.5 // margin
  // );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: false,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: 1,
    skipY: 1
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
  const appletObjects: AppletObject[] = [
    new FunctionFragment('x+3', PrimeColor.blue, {
      domain: { xMax: 1 },
      legendText:
        'f(x)=\\left\\{\\begin{array}{ll}x+3,&\\text{if }\\,x\\leq 1,\\\\ 2x+4,&\\text{if }\\,x>1.\\end{array}\\right.',
      width: 0.12
    }).addIncludedPoints(new Vector2(1, 4), undefined, 0.18),
    new FunctionFragment('2x+4', PrimeColor.blue, {
      domain: { xMin: 1 },
      width: 0.12
    }).addGaps(new Vector2(1, 6), undefined, 0.18),
    new FunctionFragment('1/x', PrimeColor.darkGreen, {
      legendText: 'g(x)=\\frac{1}{x}',
      width: 0.12,
      stepSize: 0.0001
    })
  ];
</script>

<CanvasGrid
  columns={2}
  rows={1}
  legendItems={getLegend(appletObjects)}
  legendFormulaPosition="top-center"
>
  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={[appletObjects[0], appletObjects[1]]} />
  </GridCanvas2D>
  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={[appletObjects[2]]} />
  </GridCanvas2D>
</CanvasGrid>
