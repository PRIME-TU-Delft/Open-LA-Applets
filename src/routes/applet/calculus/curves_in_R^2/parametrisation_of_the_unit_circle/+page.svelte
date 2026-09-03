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
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';

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
  const a = 3;
  function snapToCircle(position: Vector2) {
    let x = position.x;
    let y = position.y;
    let theta = Math.atan2(y, x);
    theta = theta / Math.PI;
    if (theta < 0) {
      theta += 2;
    }
    theta = Number(theta.toFixed(2));
    theta = Math.min(theta, 2);
    theta = Math.max(0, theta);
    theta = theta * Math.PI;
    x = a * Math.cos(theta);
    y = a * Math.sin(theta);
    return new Vector2(x, y);
  }
  const draggables = [
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
  const xC = $derived(draggables[0].position.x);
  const yC = $derived(draggables[0].position.y);

  function ZeroFunc(x: number, y: number): number {
    return x ** 2 + y ** 2 - a ** 2;
  }
  const appletObjects: AppletObject[] = [
    new ImplicitFunctionFragment(ZeroFunc, PrimeColor.blue, { width: 0.08 })
  ];
  function theta(position: Vector2): number {
    const x = position.x;
    const y = position.y;
    let angle = Math.atan2(y, x);
    if (angle < 0) {
      angle += 2 * Math.PI;
    }
    return angle;
  }
</script>

<Canvas2D
  {draggables}
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
  <Line2D
    start={draggables[0].position}
    end={new Vector2(xC, 0)}
    isDashed={true}
    color={PrimeColor.cyan}
    width={0.05}
  />
  <Line2D
    start={draggables[0].position}
    end={new Vector2(0, yC)}
    isDashed={true}
    color={PrimeColor.green}
    width={0.05}
  />
  <Line2D
    start={draggables[0].position.clone().multiplyScalar(1.4)}
    end={new Vector2(0, 0)}
    isDashed={true}
    color={PrimeColor.pink}
    width={0.05}
  />
  <Latex2D
    latex="\cos(t)"
    position={new Vector2(xC, 0)}
    alignY={yC < 0 ? 'bottom' : 'top'}
    alignX="center"
    color={PrimeColor.cyan}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
  />
  <Latex2D
    latex="\sin(t)"
    position={new Vector2(xC > 0 ? -0.25 : 0.15, yC)}
    alignX={xC < 0 ? 'left' : 'right'}
    alignY="center"
    color={PrimeColor.green}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
  />
  <Point2D color={PrimeColor.cyan} position={new Vector2(xC, 0)} shape="triangle" radius={0.15} />
  <Point2D color={PrimeColor.green} position={new Vector2(0, yC)} shape="triangle" radius={0.15} />
  <Latex2D
    latex="t"
    position={draggables[0].position}
    alignX={xC > 0 ? 'left' : 'right'}
    alignY={yC > 0 ? 'bottom' : 'top'}
    color={PrimeColor.pink}
  />
  <Latex2D latex="t=0" position={new Vector2(3.15, -0.15)} alignX="left" alignY="top" />
  <Latex2D latex="t=\pi" position={new Vector2(-3.15, -0.15)} alignX="right" alignY="top" />
  <Latex2D
    latex="t=\frac12\pi"
    position={new Vector2(-0.15, 3.15)}
    alignX="right"
    alignY="bottom"
  />
  <Latex2D latex="t=\frac32\pi" position={new Vector2(-0.15, -3.15)} alignX="right" alignY="top" />
  <Angle2D
    startAngle={0}
    endAngle={theta(draggables[0].position)}
    hasHead={true}
    color={PrimeColor.yellow}
    distance={3}
  />
</Canvas2D>
