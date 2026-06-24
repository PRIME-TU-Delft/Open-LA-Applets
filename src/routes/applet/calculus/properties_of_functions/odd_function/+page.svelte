<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    FunctionFragment,
    LineFragment,
    Point,
    Text
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { ViewBox } from '$lib/d3/ViewBox';

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
  cameraPosition = new Vector2(0, 1);
  cameraZoom = 1.2;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-3, -4), // bottom-left
    new Vector2(3, 4), // top-right
    0.5 // margin
  );

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
    additionalTicksY: [3, -3]
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
    new FunctionFragment('|x|x', PrimeColor.blue),
    new Text('a', new Vector2(Math.sqrt(3), 0), PrimeColor.raspberry, {
      alignX: 'center',
      alignY: 'top'
    }),
    new Text('-a', new Vector2(-Math.sqrt(3), 0), PrimeColor.orange, {
      alignX: 'center',
      alignY: 'bottom'
    }),
    new Text('(-a,f(-a))', new Vector2(-Math.sqrt(3) - 0.1, -3), PrimeColor.orange, {
      alignX: 'right',
      alignY: 'bottom'
    }),
    new Text('(a,f(a))', new Vector2(Math.sqrt(3) + 0.1, 3), PrimeColor.raspberry, {
      alignX: 'left',
      alignY: 'top'
    }),
    new Point(new Vector2(Math.sqrt(3), 3), PrimeColor.raspberry),
    new Point(new Vector2(-Math.sqrt(3), -3), PrimeColor.orange),
    new LineFragment(
      new Vector2(Math.sqrt(3), 0),
      new Vector2(Math.sqrt(3), 3),
      PrimeColor.raspberry,
      { isDashed: true }
    ),
    new LineFragment(new Vector2(Math.sqrt(3), 3), new Vector2(0, 0), PrimeColor.raspberry, {
      isDashed: true
    }),
    new LineFragment(
      new Vector2(-Math.sqrt(3), -3),
      new Vector2(-Math.sqrt(3), 0),
      PrimeColor.orange,
      { isDashed: true }
    ),
    new LineFragment(new Vector2(-Math.sqrt(3), -3), new Vector2(0, 0), PrimeColor.orange, {
      isDashed: true
    })
  ];
</script>

<Canvas2D
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
