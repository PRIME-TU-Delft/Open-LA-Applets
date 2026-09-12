<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import { AppletObject, Polygon } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';

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
    new Vector2(-3, -4), // bottom-left
    new Vector2(5, 4), // top-right
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

  function SnapToGrid(position: Vector2): Vector2 {
    const re = position.x;
    const im = position.y;
    const theta = Math.atan2(im, re);
    const snappedR = 3;
    let snappedTheta = Number((theta / Math.PI).toFixed(2)) * Math.PI;
    if (snappedTheta < 0) {
      if (snappedTheta < -Math.PI / 2) {
        snappedTheta = Math.PI;
      } else {
        snappedTheta = 0;
      }
    }
    const snappedX = snappedR * Math.cos(snappedTheta);
    const snappedY = snappedR * Math.sin(snappedTheta);
    return new Vector2(snappedX, snappedY);
  }
  const r = 3;
  const theta0 = 0.6 * Math.PI;
  const beta0 = 0.2 * Math.PI;
  const re = r * Math.cos(theta0);
  const im = r * Math.sin(theta0);
  const Qx = r * Math.cos(beta0);
  const Qy = r * Math.sin(beta0);
  const draggablePoint = [
    new Draggable(new Vector2(re, im), PrimeColor.darkGreen, undefined, SnapToGrid),
    new Draggable(new Vector2(Qx, Qy), PrimeColor.orange, undefined, SnapToGrid)
  ];
  const P = $derived(draggablePoint[0].position);
  const Q = $derived(draggablePoint[1].position);
  const O = new Vector2(0, 0);
  const alpha = $derived(Math.atan2(P.y, P.x));
  const beta = $derived(Math.atan2(Q.y, Q.x));
  const theta = $derived(alpha - beta);

  const appletObjects: AppletObject[] = $derived.by(() => {
    return [new Polygon([O, P, Q], PrimeColor.blue, { width: 1.5 })];
  });
</script>

<Canvas2D
  draggables={draggablePoint}
  {initialViewBox}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <ParameterizedFunction2D
    xFunc={(t: number) => 3 * Math.cos(t)}
    yFunc={(t: number) => 3 * Math.sin(t)}
    tStart={0}
    tEnd={2 * Math.PI}
    width={0.05}
  />
  <TemplateComponent objects={appletObjects} />
  <Angle2D
    color={PrimeColor.pink}
    origin={O}
    startAngle={0}
    endAngle={beta}
    hasHead={true}
    distance={1.5}
    width={0.05}
  />
  <Angle2D
    color={PrimeColor.purple}
    origin={O}
    startAngle={beta}
    endAngle={alpha}
    hasHead={true}
    distance={1.2}
    width={0.05}
  />
  <Latex2D latex="1" position={new Vector2(3.15, -0.15)} alignX="left" alignY="top" />
  <Latex2D latex="-1" position={new Vector2(-3.15, -0.15)} alignX="right" alignY="top" />
  <Latex2D latex="1" position={new Vector2(-0.15, 3.15)} alignX="right" alignY="bottom" />
  <Latex2D latex="-1" position={new Vector2(-0.15, -3.15)} alignX="right" alignY="top" />
  <Latex2D
    latex="P"
    position={P}
    extend={0.35}
    alignX="center"
    alignY="center"
    color={PrimeColor.darkGreen}
  />
  <Latex2D
    latex="Q"
    position={Q}
    extend={0.35}
    alignX="center"
    alignY="center"
    color={PrimeColor.orange}
  />
  <Latex2D
    latex="\beta"
    position={new Vector2(1.5 * Math.cos(beta / 2), 1.5 * Math.sin(beta / 2))}
    alignX="center"
    alignY="center"
    color={PrimeColor.pink}
    extend={0.4}
  />
  <Latex2D
    latex="\beta-\alpha"
    position={new Vector2(1.2 * Math.cos(beta + theta / 2), 1.2 * Math.sin(beta + theta / 2))}
    alignX="center"
    alignY="center"
    color={PrimeColor.purple}
    extend={0.4}
  />
</Canvas2D>
