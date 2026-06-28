<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Text } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';

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
  cameraPosition = new Vector2(0, 0);
  cameraZoom = 0.5;

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
    skipX: 0,
    skipY: 0
  };

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 10;
  let scaleY = 10;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const Nmax = 100;
  let Gaps = [];
  let Points = [];
  for (let i = 3; i <= Nmax; i++) {
    Gaps.push(new Vector2(1 / i, 1 / i));
    Gaps.push(new Vector2(1 - 1 / i, 1 - 1 / i));
    Points.push(new Vector2(1 / i, 1 / (2 * i)));
    Points.push(new Vector2(1 - 1 / i, 1 / (2 * i + 1)));
  }
  const appletObjects: AppletObject[] = [
    new FunctionFragment((x: number) => x, PrimeColor.blue, {
      domain: { xMin: -1, xMax: 1 },
      legendText: 'f(x)',
      width: 0.1
    })
      .addGaps(Gaps, undefined, 0.11)
      .addIncludedPoints(Points, undefined, 0.11),
    new Text('1', new Vector2(1, 0), PrimeColor.black, { alignX: 'center', alignY: 'top' }),
    new Text('-1', new Vector2(-1, 0), PrimeColor.black, { alignX: 'center', alignY: 'top' }),
    new Text('1', new Vector2(0, 1), PrimeColor.black, { alignX: 'right', alignY: 'center' }),
    new Text('-1', new Vector2(0, -1), PrimeColor.black, { alignX: 'right', alignY: 'center' })
  ];
</script>

<Canvas2D
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  legendFormulaPosition="top-left"
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
