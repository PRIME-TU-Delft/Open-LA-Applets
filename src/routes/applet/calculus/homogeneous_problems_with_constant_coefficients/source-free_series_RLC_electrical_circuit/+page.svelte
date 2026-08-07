<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, LineFragment, Polygon, Text } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Angle2D from '$lib/d3/Angle2D.svelte';

  let initialViewBox: ViewBox | undefined;

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
    new Vector2(-5, 0), // bottom-left
    new Vector2(5.5, 7), // top-right
    0.5 // margin
  );

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 1;
  let scaleY = 1;

  // ##############
  // APPLET OBJECTS
  // ##############
  const step = 1 / 4;
  const appletObjects: AppletObject[] = [
    new Polygon(
      [new Vector2(4, 1), new Vector2(4, 6), new Vector2(-4, 6), new Vector2(-4, 1)],
      PrimeColor.black
    ),
    new LineFragment(new Vector2(4, 2.5), new Vector2(4, 4.5), PrimeColor.white, { width: 0.06 }),
    new LineFragment(new Vector2(3.5, 3.4), new Vector2(4.5, 3.4), PrimeColor.darkGreen, {
      width: 0.05
    }),
    new LineFragment(new Vector2(3.5, 3.6), new Vector2(4.5, 3.6), PrimeColor.darkGreen, {
      width: 0.05
    }),
    new LineFragment(new Vector2(4, 2.5), new Vector2(4, 3.4), PrimeColor.darkGreen, {
      width: 0.05
    }),
    new LineFragment(new Vector2(4, 3.6), new Vector2(4, 4.5), PrimeColor.darkGreen, {
      width: 0.05
    }),
    new Text('C', new Vector2(4.65, 3.5), PrimeColor.darkGreen, {
      alignX: 'left',
      alignY: 'center'
    }),
    new LineFragment(new Vector2(-3, 6), new Vector2(-1, 6), PrimeColor.white, { width: 0.07 }),
    new LineFragment(new Vector2(-3, 6), new Vector2(-2.75, 6), PrimeColor.darkGreen, {
      width: 0.05
    }),
    new LineFragment(new Vector2(-1.25, 6), new Vector2(-1, 6), PrimeColor.darkGreen, {
      width: 0.05
    }),
    new Text('R', new Vector2(-2, 6.3), PrimeColor.darkGreen, {
      alignX: 'center',
      alignY: 'bottom'
    }),
    new Polygon(
      [
        new Vector2(-2.75, 6.25),
        new Vector2(-2.75, 5.75),
        new Vector2(-1.25, 5.75),
        new Vector2(-1.25, 6.25)
      ],
      PrimeColor.darkGreen
    ),
    new LineFragment(new Vector2(1, 6), new Vector2(3, 6), PrimeColor.white, { width: 0.07 }),
    new Text('L', new Vector2(2, 6.3), PrimeColor.darkGreen, {
      alignX: 'center',
      alignY: 'bottom'
    }),
    new Text('i', new Vector2(0, 3.5), PrimeColor.raspberry, { alignX: 'center', alignY: 'center' })
  ];
</script>

<Canvas2D {initialViewBox} axis={null} {scaleX} {scaleY}>
  <TemplateComponent objects={appletObjects} />
  <Angle2D
    color={PrimeColor.darkGreen}
    startAngle={0}
    endAngle={Math.PI}
    origin={new Vector2(1 + step, 6)}
    width={0.05}
    distance={step}
  />
  <Angle2D
    color={PrimeColor.darkGreen}
    startAngle={0}
    endAngle={Math.PI}
    origin={new Vector2(1 + 3 * step, 6)}
    width={0.05}
    distance={step}
  />
  <Angle2D
    color={PrimeColor.darkGreen}
    startAngle={0}
    endAngle={Math.PI}
    origin={new Vector2(1 + 5 * step, 6)}
    width={0.05}
    distance={step}
  />
  <Angle2D
    color={PrimeColor.darkGreen}
    startAngle={0}
    endAngle={Math.PI}
    origin={new Vector2(1 + 7 * step, 6)}
    width={0.05}
    distance={step}
  />
  <Point2D position={new Vector2(1, 6)} color={PrimeColor.darkGreen} radius={0.01} />
  <Point2D position={new Vector2(1 + 2 * step, 6)} color={PrimeColor.darkGreen} radius={0.01} />
  <Point2D position={new Vector2(1 + 4 * step, 6)} color={PrimeColor.darkGreen} radius={0.01} />
  <Point2D position={new Vector2(1 + 6 * step, 6)} color={PrimeColor.darkGreen} radius={0.01} />
  <Point2D position={new Vector2(1 + 8 * step, 6)} color={PrimeColor.darkGreen} radius={0.01} />
  <Angle2D
    color={PrimeColor.raspberry}
    startAngle={(5 / 4) * Math.PI}
    endAngle={(-1 / 2) * Math.PI}
    origin={new Vector2(0, 3.5)}
    distance={2}
    width={0.05}
    hasHead={true}
  />
</Canvas2D>
