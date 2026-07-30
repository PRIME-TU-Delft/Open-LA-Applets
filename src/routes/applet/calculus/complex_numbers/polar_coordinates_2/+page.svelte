<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import PolarGrid from '$lib/d3/PolarGrid.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { toLatexText } from '$lib/utils/FormatString';
  import Point2D from '$lib/d3/Point2D.svelte';

  let initialViewBox: ViewBox | undefined;
  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;
  let axis: AxisProps | undefined;
  let axisP: AxisProps | undefined;

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
    new Vector2(-3, -4), // bottom-left
    new Vector2(4, 7), // top-right
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
  axisP = {
    showOrigin: true,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: 0,
    skipY: 0,
    showGridLinesX: false,
    showGridLinesY: false
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
  xAxisLabel = '\\operatorname{Re}';
  yAxisLabel = '\\operatorname{Im}';

  function SnapToGrid(position: Vector2): Vector2 {
    const re = position.x;
    const im = position.y;
    const r = Math.sqrt(re * re + im * im);
    const theta = Math.atan2(im, re);
    const snappedR = Number(r.toFixed(1));
    const snappedTheta = Number((theta / Math.PI).toFixed(2)) * Math.PI;
    const snappedX = snappedR * Math.cos(snappedTheta);
    const snappedY = snappedR * Math.sin(snappedTheta);
    return new Vector2(snappedX, snappedY);
  }
  const r = 3 * Math.sqrt(2);
  const theta = 0.25 * Math.PI;
  const re = r * Math.cos(theta);
  const im = r * Math.sin(theta);
  const draggablePoint = [
    new Draggable(new Vector2(re, im), PrimeColor.green, undefined, SnapToGrid)
  ];
  const toggleControls = Controls.addToggle(
    false,
    toLatexText('Cartesian grid'),
    PrimeColor.black,
    { isSwitch: true, switchRightSide: toLatexText('Polar grid') }
  );
</script>

<Canvas2D
  controls={toggleControls}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  axis={toggleControls[0] ? axisP : axis}
  {scaleX}
  {scaleY}
  showFormulasDefault={true}
>
  {#if toggleControls[0]}
    <PolarGrid showAngleTicks showRadiiTicks={false} />
  {/if}
  {@const re = draggablePoint[0].position.x}
  {@const im = draggablePoint[0].position.y}
  {@const r = Math.sqrt(re * re + im * im)}
  {@const theta = Math.atan2(im, re)}
  {@const phi = theta + Math.PI / 2}
  {@const shift = new Vector2(Math.cos(phi), Math.sin(phi)).multiplyScalar(0.5)}
  <Latex2D
    latex="3+3i"
    position={draggablePoint[0].position}
    color={PrimeColor.green}
    alignX={draggablePoint[0].position.x < 0 ? 'right' : 'left'}
    alignY={draggablePoint[0].position.y < 0 ? 'top' : 'bottom'}
    offset={new Vector2(
      draggablePoint[0].position.x < 0 ? -0.1 : 0.1,
      draggablePoint[0].position.y < 0 ? -0.1 : 0.1
    )}
  />
  <Line2D
    start={draggablePoint[0].position}
    end={new Vector2(0, 0)}
    color={PrimeColor.green}
    width={0.05}
  />
  <Line2D
    start={draggablePoint[0].position}
    end={draggablePoint[0].position.clone().add(shift.clone().multiplyScalar(theta > 0 ? 2 : -2))}
    color={PrimeColor.blue}
    width={0.05}
    isDashed={true}
  />
  <Line2D
    start={new Vector2(0, 0)}
    end={shift.clone().multiplyScalar(theta > 0 ? 2 : -2)}
    color={PrimeColor.blue}
    width={0.05}
    isDashed={true}
  />
  <Vector2D
    direction={draggablePoint[0].position.clone()}
    origin={shift.clone().multiplyScalar(theta > 0 ? 1 : -1)}
    color={PrimeColor.blue}
    length={r}
    doubleEnded={true}
  />
  <Latex2D
    latex="3\sqrt{2}"
    color={PrimeColor.blue}
    position={shift
      .clone()
      .multiplyScalar(theta > 0 ? 1.5 : -1.5)
      .add(draggablePoint[0].position.clone().multiplyScalar(0.5))}
    alignX="right"
    alignY="bottom"
  />
  <Angle2D
    startAngle={0}
    endAngle={theta}
    hasHead={true}
    distance={0.5 * r}
    color={PrimeColor.orange}
    width={0.05}
  />
  <Latex2D
    latex={String.raw`\frac{1}{4}\pi`}
    color={PrimeColor.orange}
    position={new Vector2(0.5 * r * Math.cos(theta / 2), 0.5 * r * Math.sin(theta / 2)).add(
      new Vector2(Math.cos(theta / 2), Math.sin(theta / 2)).multiplyScalar(0.5)
    )}
    alignX="left"
    alignY="center"
  />
  <Point2D position={draggablePoint[0].position} color={PrimeColor.green} />
  <Line2D
    start={draggablePoint[0].position}
    end={new Vector2(draggablePoint[0].position.x, 0)}
    color={PrimeColor.green}
    width={0.05}
    isDashed={true}
  />
  <Line2D
    start={draggablePoint[0].position}
    end={new Vector2(0, draggablePoint[0].position.y)}
    color={PrimeColor.green}
    width={0.05}
    isDashed={true}
  />
</Canvas2D>
