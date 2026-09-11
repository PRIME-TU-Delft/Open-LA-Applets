<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Point } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
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

  const Function = (x: number) => Math.abs(x) / 2 - Math.cos(x);
  const a = -2 * Math.PI;
  const b = 2 * Math.PI;
  const c = (-11 / 6) * Math.PI;
  const d = (-7 / 6) * Math.PI;
  const e = (7 / 6) * Math.PI;
  const f = (11 / 6) * Math.PI;

  // ###############
  // CAMERA SETTINGS
  // ###############
  // choose one or none of the options below - if both are specified, view box will be used

  // (remove if unnecessary)
  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-8, -2), // bottom-left
    new Vector2(8, 4), // top-right
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
  let scaleY = 2;

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
    new FunctionFragment(Function, PrimeColor.blue, {
      domain: { xMin: a, xMax: b },
      width: 0.08
    }),
    new Point(new Vector2(0, Function(0)), PrimeColor.orange, {
      shape: 'triangle',
      legendText: '\\text{global minimum}',
      radius: 0.24
    }),
    new Point(new Vector2(d, Function(d)), PrimeColor.green, {
      shape: 'square',
      legendText: '\\text{global maximum}',
      radius: 0.23
    }),
    new Point(new Vector2(e, Function(e)), PrimeColor.green, {
      shape: 'square',
      radius: 0.23
    }),
    new Point(new Vector2(c, Function(c)), PrimeColor.yellow, {
      shape: 'triangle',
      legendText: '\\text{local minimum}',
      radius: 0.15
    }),
    new Point(new Vector2(f, Function(f)), PrimeColor.yellow, {
      shape: 'triangle',
      radius: 0.15
    }),
    new Point(new Vector2(0, Function(0)), PrimeColor.yellow, {
      shape: 'triangle',
      radius: 0.15
    }),
    new Point(new Vector2(d, Function(d)), PrimeColor.raspberry, {
      shape: 'square',
      legendText: '\\text{local maximum}',
      radius: 0.15
    }),
    new Point(new Vector2(e, Function(e)), PrimeColor.raspberry, {
      shape: 'square',
      radius: 0.15
    }),
    new Point(new Vector2(a, Function(a)), PrimeColor.cyan, {
      shape: 'circle',
      legendText: '\\text{left endpoint}',
      radius: 0.15
    }),
    new Point(new Vector2(b, Function(b)), PrimeColor.pink, {
      shape: 'diamond',
      legendText: '\\text{right endpoint}',
      radius: 0.15
    })
  ];
</script>

<CanvasGrid
  rows={1}
  columns={10}
  legendItems={[...getLegend(appletObjects)]}
  legendFormulaPosition="bottom-right"
>
  <GridCanvas2D
    gridColumn="1 / span 10"
    gridRow="1"
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects} />
  </GridCanvas2D>
</CanvasGrid>
