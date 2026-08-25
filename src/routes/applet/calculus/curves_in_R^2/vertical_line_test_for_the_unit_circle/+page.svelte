<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, ImplicitFunctionFragment } from '$lib/template/TemplateAppletObjects';
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
  import Line2D from '$lib/d3/Line2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';

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
  function snapToAxis(position: Vector2) {
    const x = Number(position.x.toFixed(1));
    const y = 0;
    return new Vector2(x, y);
  }
  const a = 3;
  function snapToCircle(position: Vector2) {
    let x = position.x;
    let y = position.y;
    let theta = Math.atan2(y, x);
    theta = theta / Math.PI;
    theta = Number(theta.toFixed(2));
    theta = theta * Math.PI;
    x = a * Math.cos(theta);
    y = a * Math.sin(theta);
    return new Vector2(x, y);
  }
  const draggables = [
    new Draggable(
      new Vector2(-2, 0),
      PrimeColor.orange,
      undefined,
      snapToAxis,
      undefined,
      undefined,
      0.15
    ),
    new Draggable(
      new Vector2(a / Math.sqrt(2), a / Math.sqrt(2)),
      PrimeColor.pink,
      undefined,
      snapToCircle,
      undefined,
      undefined,
      0.15,
      'diamond'
    )
  ];
  const xD = $derived(draggables[0].position.x);
  const xC = $derived(draggables[1].position.x);
  const yC = $derived(draggables[1].position.y);

  function ZeroFunc(x: number, y: number): number {
    return x ** 2 + y ** 2 - a ** 2;
  }
  const appletObjects: AppletObject[] = [
    new ImplicitFunctionFragment(ZeroFunc, PrimeColor.blue, { width: 0.08 })
  ];
  function TopFunction(x: number): number {
    return Math.sqrt(a ** 2 - x ** 2);
  }
  function BottomFunction(x: number): number {
    return -TopFunction(x);
  }
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
    origin={new Vector2(xD, 0)}
    direction={new Vector2(0, 1)}
    color={PrimeColor.darkGreen}
    width={0.08}
  />
  {#if Math.abs(xD) <= a}
    <Point2D
      color={PrimeColor.yellow}
      position={new Vector2(xD, TopFunction(xD))}
      shape="square"
      radius={0.15}
    />
    <Point2D
      color={PrimeColor.yellow}
      position={new Vector2(xD, BottomFunction(xD))}
      shape="square"
      radius={0.15}
    />
  {/if}
  <Line2D
    start={draggables[1].position}
    end={new Vector2(xC, 0)}
    isDashed={true}
    color={PrimeColor.cyan}
    width={0.05}
  />
  <Line2D
    start={draggables[1].position}
    end={new Vector2(0, yC)}
    isDashed={true}
    color={PrimeColor.green}
    width={0.05}
  />
  <Line2D
    start={draggables[1].position}
    end={new Vector2(0, 0)}
    isDashed={true}
    color={PrimeColor.pink}
    width={0.05}
  />
  <Point2D color={PrimeColor.cyan} position={new Vector2(xC, 0)} shape="triangle" radius={0.15} />
  <Point2D color={PrimeColor.green} position={new Vector2(0, yC)} shape="triangle" radius={0.15} />
  <Latex2D
    latex="a"
    position={new Vector2(xC, 0)}
    alignY={yC < 0 ? 'bottom' : 'top'}
    alignX="center"
    color={PrimeColor.cyan}
  />
  <Latex2D
    latex="b"
    position={new Vector2(xC > 0 ? -0.25 : 0.15, yC)}
    alignX={xC < 0 ? 'left' : 'right'}
    alignY="center"
    color={PrimeColor.green}
  />
  <Latex2D
    latex="(a,b)"
    position={draggables[1].position}
    alignX={xC > 0 ? 'left' : 'right'}
    alignY={yC > 0 ? 'bottom' : 'top'}
    color={PrimeColor.pink}
  />
  <Latex2D latex="1" position={new Vector2(3.15, -0.15)} alignX="left" alignY="top" />
  <Latex2D latex="-1" position={new Vector2(-3.15, -0.15)} alignX="right" alignY="top" />
  <Latex2D latex="1" position={new Vector2(-0.15, 3.15)} alignX="right" alignY="bottom" />
  <Latex2D latex="-1" position={new Vector2(-0.15, -3.15)} alignX="right" alignY="top" />
</Canvas2D>
