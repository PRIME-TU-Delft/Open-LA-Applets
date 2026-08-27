<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    FunctionFragment,
    Point,
    Polygon,
    Text
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';

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
    new Vector2(-0.5, -0.5), // bottom-left
    new Vector2(3.5, 3), // top-right
    0.5 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 2;
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
  const Function = (x: number) => x + Math.sin(2 * x);
  const a = 0.3;
  const b = Math.PI / 3;
  const c = (2 * Math.PI) / 3;
  const d = 2.9;
  const DeltaX = 0.4;
  const DeltaY = 0.2;
  const appletObjects: AppletObject[] = [
    new Polygon(
      [
        new Vector2(b - DeltaX, Function(b) - DeltaY),
        new Vector2(b + DeltaX, Function(b) - DeltaY),
        new Vector2(b + DeltaX, Function(b) + DeltaY),
        new Vector2(b - DeltaX, Function(b) + DeltaY)
      ],
      PrimeColor.darkGreen + PrimeColor.opacity(0.3),
      {
        fillStyle: 'full'
      }
    ),
    new Polygon(
      [
        new Vector2(c - DeltaX, Function(c) - DeltaY),
        new Vector2(c + DeltaX, Function(c) - DeltaY),
        new Vector2(c + DeltaX, Function(c) + DeltaY),
        new Vector2(c - DeltaX, Function(c) + DeltaY)
      ],
      PrimeColor.yellow + PrimeColor.opacity(0.3),
      {
        fillStyle: 'full'
      }
    ),
    new FunctionFragment(Function, PrimeColor.blue, {
      domain: { xMin: a, xMax: d },
      legendText: `f(x)`,
      width: 0.08
    }),
    new Point(new Vector2(a, Function(a)), PrimeColor.orange),
    new Point(new Vector2(b, Function(b)), PrimeColor.darkGreen, {
      shape: 'square'
    }),
    new Point(new Vector2(c, Function(c)), PrimeColor.yellow, {
      shape: 'triangle'
    }),
    new Point(new Vector2(d, Function(d)), PrimeColor.raspberry, {
      shape: 'diamond'
    }),
    new Text('a', new Vector2(a, -0.1), PrimeColor.orange, { alignX: 'center', alignY: 'top' }),
    new Text('b', new Vector2(b, -0.1), PrimeColor.darkGreen, { alignX: 'center', alignY: 'top' }),
    new Text('c', new Vector2(c, -0.1), PrimeColor.yellow, { alignX: 'center', alignY: 'top' }),
    new Text('d', new Vector2(d, -0.1), PrimeColor.raspberry, { alignX: 'center', alignY: 'top' })
  ];

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: false,
    showAxisNumbersY: false,
    logarithmicX: false,
    logarithmicY: false,
    skipX: -1,
    skipY: -1,
    additionalTicksX: [a, b, c, d],
    additionalTicksY: [Function(a), Function(b), Function(c), Function(d)]
  };
</script>

<Canvas2D
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
