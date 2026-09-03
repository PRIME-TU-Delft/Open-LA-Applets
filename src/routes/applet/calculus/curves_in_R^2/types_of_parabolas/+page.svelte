<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, ImplicitFunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import { toLatexText } from '$lib/utils/FormatString';

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
    new Vector2(-3, -4), // bottom-left
    new Vector2(3, 7), // top-right
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
  const appletObjects: AppletObject[] = [
    new ImplicitFunctionFragment('y=x^2', PrimeColor.blue, {
      legendText: toLatexText('$y=x^2$ opens upwards'),
      width: 0.08
    }),
    new ImplicitFunctionFragment('y=-x^2', PrimeColor.darkGreen, {
      legendText: toLatexText('$y=-x^2$ opens downwards'),
      width: 0.08
    }),
    new ImplicitFunctionFragment('x=-y^2', PrimeColor.raspberry, {
      legendText: toLatexText('$x=-y^2$ opens to the left'),
      width: 0.08
    }),
    new ImplicitFunctionFragment('x=y^2', PrimeColor.orange, {
      legendText: toLatexText('$x=y^2$ opens to the right'),
      width: 0.08
    })
  ];
</script>

<CanvasGrid
  columns={2}
  rows={2}
  legendFormulaPosition="center"
  legendItems={getLegend(appletObjects)}
>
  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={[appletObjects[0]]} />
  </GridCanvas2D>
  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={[appletObjects[1]]} />
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
  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={[appletObjects[3]]} />
  </GridCanvas2D>
</CanvasGrid>
