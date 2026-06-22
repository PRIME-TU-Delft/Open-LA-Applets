<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    FunctionFragment,
    LineFragment,
    Point,
    Polygon,
    Text
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
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
  cameraPosition = new Vector2(0, 2);
  cameraZoom = 1.4;

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
    skipY: -1,
    additionalTicksX: [Math.sqrt(3), -Math.sqrt(3)],
    additionalTicksY: [3]
  };

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
  const appletObjects: AppletObject[] = [
    new Polygon(
      [
        new Vector2(0.55, 3.05),
        new Vector2(0.55, 3.65),
        new Vector2(-0.7, 3.65),
        new Vector2(-0.7, 3.05)
      ],
      PrimeColor.white,
      { fillStyle: 'full' }
    ),
    new FunctionFragment('x^2', PrimeColor.blue),
    new Text('a', new Vector2(Math.sqrt(3), 0), PrimeColor.raspberry, {
      alignX: 'center',
      alignY: 'top'
    }),
    new Text('-a', new Vector2(-Math.sqrt(3), 0), PrimeColor.orange, {
      alignX: 'center',
      alignY: 'top'
    }),
    new Text('(-a,f(-a))', new Vector2(-Math.sqrt(3) - 0.1, 3), PrimeColor.orange, {
      alignX: 'right',
      alignY: 'top'
    }),
    new Text('(a,f(a))', new Vector2(Math.sqrt(3) + 0.1, 3), PrimeColor.raspberry, {
      alignX: 'left',
      alignY: 'top'
    }),
    new Point(new Vector2(Math.sqrt(3), 3), PrimeColor.raspberry),
    new Point(new Vector2(-Math.sqrt(3), 3), PrimeColor.orange),
    new LineFragment(
      new Vector2(Math.sqrt(3), 0),
      new Vector2(Math.sqrt(3), 3),
      PrimeColor.raspberry,
      { isDashed: true }
    ),
    new LineFragment(new Vector2(Math.sqrt(3), 3), new Vector2(0, 3), PrimeColor.raspberry, {
      isDashed: true
    }),
    new LineFragment(
      new Vector2(-Math.sqrt(3), 3),
      new Vector2(-Math.sqrt(3), 0),
      PrimeColor.orange,
      { isDashed: true }
    ),
    new LineFragment(new Vector2(-Math.sqrt(3), 3), new Vector2(0, 3), PrimeColor.orange, {
      isDashed: true
    }),
    new Text('f(a)', new Vector2(0.1, 3.1), PrimeColor.raspberry, {
      alignX: 'left',
      alignY: 'bottom'
    }),
    new Text('f(-a)', new Vector2(-0.1, 3.1), PrimeColor.orange, {
      alignX: 'right',
      alignY: 'bottom'
    }),
    new Text('=', new Vector2(0, 3.1), PrimeColor.blue, { alignX: 'center', alignY: 'bottom' })
  ];
</script>

<Canvas2D
  {cameraPosition}
  {cameraZoom}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
