<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Point } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import { getLegend } from '$lib/template/ObjectFormulas';

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
    new Vector2(-1, -5), // bottom-left
    new Vector2(7, 2), // top-right
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
    skipX: 1,
    skipY: 0
  };

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 4;
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
  const a = 0;
  const b = 1;
  const c = 0.612201;
  const func = (x: number) => x ** 5 - 8 * x ** 3 + 2 * x ** 2 + 1;
  const appletObjects: AppletObject[] = [
    new FunctionFragment(func, PrimeColor.blue, {
      domain: { xMin: 0, xMax: 1 },
      legendText: 'f(x) = x^5 - 8x^3 + 2x^2 + 1'
    }).addIncludedPoints([new Vector2(0, func(0)), new Vector2(1, func(1))]),
    new Point(new Vector2(c, 0), PrimeColor.raspberry, { legendText: '(c,0)' })
  ];
</script>

<Canvas2D
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
  <InfiniteLine2D
    direction={new Vector2(1, 0)}
    color={PrimeColor.orange}
    isDashed={true}
    origin={new Vector2(0, func(a))}
  />
  <InfiniteLine2D
    direction={new Vector2(1, 0)}
    color={PrimeColor.darkGreen}
    isDashed={true}
    origin={new Vector2(0, func(b))}
  />
  <InfiniteLine2D
    direction={new Vector2(0, 1)}
    color={PrimeColor.raspberry}
    isDashed={true}
    origin={new Vector2(c, 0)}
  />
</Canvas2D>
