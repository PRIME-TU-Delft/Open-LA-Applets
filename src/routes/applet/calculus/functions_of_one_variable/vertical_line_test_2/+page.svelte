<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    ParameterizedFunctionFragment,
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';

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
    new Vector2(-5, -5), // bottom-left
    new Vector2(5, 5), // top-right
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
  let xQ1 = (t: number) => (6 * Math.exp(t)) / (1 + Math.exp(t) ** 3);
  let yQ1 = (t: number) => (6 * Math.exp(t) ** 2) / (1 + Math.exp(t) ** 3);
  let xQ2 = (t: number) => (6 * t) / (1 + t ** 3);
  let yQ2 = (t: number) => (6 * t ** 2) / (1 + t ** 3);
  let xQ3 = (t: number) => yQ2(t);
  let yQ3 = (t: number) => xQ2(t);

  function roots(x: number) {
    const D = x ** 6 / 4 - 8 * x ** 3;

    // One real root
    if (D >= 0) {
      const sqrtD = Math.sqrt(D);
      const u = Math.cbrt((-1 * x ** 3) / 2 + sqrtD);
      const v = Math.cbrt((-1 * x ** 3) / 2 - sqrtD);
      return [u + v, u + v, u + v]; // triple root for plotting
    }

    // Three real roots
    const r = 2 * Math.sqrt(2 * x);
    const A = -Math.pow(x, 1.5) / (4 * Math.sqrt(2));

    // Clamp to avoid floating errors outside [-1,1]
    const theta = Math.acos(Math.max(-1, Math.min(1, A)));

    return [
      r * Math.cos(theta / 3),
      r * Math.cos((theta + 2 * Math.PI) / 3),
      r * Math.cos((theta + 4 * Math.PI) / 3)
    ];
  }

  function snapToFunction(position: Vector2) {
    let x = position.x;
    let y = 0;
    return new Vector2(x, y);
  }

  const draggables = [
    new Draggable(new Vector2(2, 0), PrimeColor.orange, undefined, snapToFunction)
  ];
  let xD = $derived(draggables[0].position.x);
  let yDs = $derived(roots(draggables[0].position.x));

  const appletObjects: AppletObject[] = [
    new ParameterizedFunctionFragment(xQ1, yQ1, PrimeColor.blue, {
      tStart: -10,
      tEnd: 10
    }),
    new ParameterizedFunctionFragment(xQ2, yQ2, PrimeColor.blue, {
      tStart: -1,
      tEnd: 0.01
    }),
    new ParameterizedFunctionFragment(xQ3, yQ3, PrimeColor.blue, {
      tStart: -1,
      tEnd: 0.01
    })
  ];
</script>

<Canvas2D
  {draggables}
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
    origin={new Vector2(draggables[0].position.x, 0)}
    direction={new Vector2(0, 1)}
    color={PrimeColor.darkGreen}
  />
  <Point2D color={PrimeColor.orange} position={new Vector2(xD, yDs[0])} shape="square" />
  <Point2D color={PrimeColor.orange} position={new Vector2(xD, yDs[1])} shape="square" />
  <Point2D color={PrimeColor.orange} position={new Vector2(xD, yDs[2])} shape="square" />
</Canvas2D>
