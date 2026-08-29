<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import { projectToParametrizedFunction2D } from '$lib/utils/MathLib';
  import { LegendItem } from '$lib/utils/Legend';
  import { toLatexText } from '$lib/utils/FormatString';
  import Point2D from '$lib/d3/Point2D.svelte';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';

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
    new Vector2(-16, -11), // bottom-left
    new Vector2(20, 13), // top-right
    0.5 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: false,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: -1,
    skipY: -1
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
  const InitialFocalPoint1 = new Vector2(-6, 2);
  const InitialFocalPoint2 = new Vector2(4, 2);
  const InitialA = 3;
  const InitialCenter = InitialFocalPoint1.clone().add(InitialFocalPoint2).multiplyScalar(0.5);
  const InitialMajorDirection = InitialFocalPoint2.clone().sub(InitialFocalPoint1).normalize();
  const InitialVertex2 = InitialCenter.clone().add(
    InitialMajorDirection.clone().multiplyScalar(InitialA)
  );
  const draggables = [
    new Draggable(
      InitialFocalPoint1,
      PrimeColor.darkGreen,
      undefined,
      SnapOthers,
      undefined,
      undefined,
      0.3,
      'square'
    ),
    new Draggable(
      InitialFocalPoint2,
      PrimeColor.orange,
      undefined,
      SnapOthers,
      undefined,
      undefined,
      0.3,
      'triangle'
    ),
    new Draggable(
      InitialVertex2,
      PrimeColor.red,
      undefined,
      SnapToMajorAxis,
      undefined,
      undefined,
      0.3
    )
  ];

  const FocalPoint1 = $derived(draggables[0].position);
  const FocalPoint2 = $derived(draggables[1].position);
  const Center = $derived(FocalPoint1.clone().add(FocalPoint2).multiplyScalar(0.5));
  const MajorDirection = $derived(FocalPoint2.clone().sub(FocalPoint1).normalize());
  const HyperbolaPoint = $derived(draggables[3].position);
  const Vertex2 = $derived(draggables[2].position);
  const A = $derived(Vertex2.clone().sub(Center).length());
  const Vertex1 = $derived(Center.clone().sub(MajorDirection.clone().multiplyScalar(A)));
  const x0 = $derived(Center.x);
  const y0 = $derived(Center.y);
  const C = $derived(FocalPoint1.clone().sub(FocalPoint2).multiplyScalar(0.5).length());
  const B = $derived(Math.sqrt(C ** 2 - A ** 2));
  const MinorDirection = $derived(new Vector2(-MajorDirection.y, MajorDirection.x));
  function HyperbolaX2(t: number): number {
    return x0 + A * MajorDirection.x * Math.cosh(t) + B * MinorDirection.x * Math.sinh(t);
  }
  function HyperbolaX1(t: number): number {
    return x0 - A * MajorDirection.x * Math.cosh(t) + B * MinorDirection.x * Math.sinh(t);
  }
  function HyperbolaY2(t: number): number {
    return y0 + A * MajorDirection.y * Math.cosh(t) + B * MinorDirection.y * Math.sinh(t);
  }
  function HyperbolaY1(t: number): number {
    return y0 - A * MajorDirection.y * Math.cosh(t) + B * MinorDirection.y * Math.sinh(t);
  }
  const tInit = 1;
  const xInit = HyperbolaX2(tInit);
  const yInit = HyperbolaY2(tInit);
  draggables.push(
    new Draggable(
      new Vector2(xInit, yInit),
      PrimeColor.pink,
      undefined,
      SnapToHyperbola,
      undefined,
      undefined,
      0.3,
      'diamond'
    )
  );
  function Quadrant(pos: Vector2): number {
    const u = pos.clone().sub(Center).dot(MajorDirection);
    const v = pos.clone().sub(Center).dot(MinorDirection);
    if (u >= 0 && v >= 0) {
      return 1;
    } else if (u < 0 && v >= 0) {
      return 2;
    } else if (u < 0 && v < 0) {
      return 3;
    } else {
      return 4;
    }
  }
  function SnapToHyperbola(position: Vector2): Vector2 {
    const x = position.x;
    const y = position.y;
    const quadrant = Quadrant(position);
    let projected: Vector2 | undefined;
    if (quadrant === 1) {
      projected = projectToParametrizedFunction2D(HyperbolaX2, HyperbolaY2, position, 0, 10)[0];
    } else if (quadrant === 2) {
      projected = projectToParametrizedFunction2D(HyperbolaX1, HyperbolaY1, position, 0, 10)[0];
    } else if (quadrant === 3) {
      projected = projectToParametrizedFunction2D(HyperbolaX1, HyperbolaY1, position, -10, 0)[0];
    } else if (quadrant === 4) {
      projected = projectToParametrizedFunction2D(HyperbolaX2, HyperbolaY2, position, -10, 0)[0];
    } else {
      projected = position;
    }
    return projected;
  }
  function SnapToMajorAxis(position: Vector2): Vector2 {
    const lineX = (t: number): number => Center.x + t * MajorDirection.x;
    const lineY = (t: number): number => Center.y + t * MajorDirection.y;
    const projected = projectToParametrizedFunction2D(lineX, lineY, position, 0.1, C - 0.1)[0];
    draggables[2].value = projected; // a bit pre-mature, but this helps for the next line
    draggables[3].value = SnapToHyperbola(draggables[3].position);
    return projected;
  }
  function SnapOthers(position: Vector2): Vector2 {
    // Make sure that C is always 0.1 more than A
    draggables[2].value = SnapToMajorAxis(draggables[2].value);
    return position;
  }
</script>

<Canvas2D
  {draggables}
  {initialViewBox}
  legendItems={[new LegendItem(toLatexText('Hyperbola'), PrimeColor.blue)]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {@const off = 0.6}
  {@const Segment1 = HyperbolaPoint.clone().sub(FocalPoint1)}
  {@const Segment2 = HyperbolaPoint.clone().sub(FocalPoint2)}
  {@const Length1 = Segment1.length()}
  {@const Length2 = Segment2.length()}
  <Latex2D
    latex={toLatexText('Major axis')}
    position={FocalPoint2}
    rotation={(Math.atan2(MajorDirection.y, MajorDirection.x) / Math.PI) * 180}
    offset={MajorDirection.clone().multiplyScalar(off)}
    alignX="left"
    alignY="bottom"
  />
  <InfiniteLine2D origin={Center} direction={MajorDirection} isDashed={true} width={0.08} />
  <Latex2D
    latex={toLatexText('Minor axis')}
    position={Center}
    rotation={(Math.atan2(MinorDirection.y, MinorDirection.x) / Math.PI) * 180}
    offset={MinorDirection.clone().multiplyScalar(off)}
    alignX="left"
    alignY="bottom"
  />
  <InfiniteLine2D origin={Center} direction={MinorDirection} isDashed={true} width={0.08} />
  <Circle2D
    position={HyperbolaPoint}
    radius={Math.abs(Length1 - Length2)}
    color={PrimeColor.pink}
    isDashed={true}
    width={0.08}
    fill={PrimeColor.pink + PrimeColor.opacity(0.1)}
  />
  <Line2D start={FocalPoint1} end={HyperbolaPoint} color={PrimeColor.darkGreen} width={0.12} />
  <Line2D start={FocalPoint2} end={HyperbolaPoint} color={PrimeColor.orange} width={0.12} />
  {#if Length1 > Length2}
    <Circle2D
      position={FocalPoint1}
      radius={Length1}
      color={PrimeColor.darkGreen}
      isDashed={true}
      width={0.08}
    />
    <Line2D
      start={FocalPoint1}
      end={FocalPoint1.clone().add(Segment2)}
      color={PrimeColor.orange}
      width={0.12}
    />
    <Circle2D
      position={FocalPoint1}
      radius={Length2}
      color={PrimeColor.orange}
      isDashed={true}
      width={0.08}
    />
  {:else}
    <Circle2D
      position={FocalPoint2}
      radius={Length2}
      color={PrimeColor.orange}
      isDashed={true}
      width={0.08}
    />
    <Line2D
      start={FocalPoint2}
      end={FocalPoint2.clone().add(Segment1)}
      color={PrimeColor.darkGreen}
      width={0.12}
    />
    <Circle2D
      position={FocalPoint2}
      radius={Length1}
      color={PrimeColor.darkGreen}
      isDashed={true}
      width={0.08}
    />
  {/if}
  <ParameterizedFunction2D
    xFunc={HyperbolaX1}
    yFunc={HyperbolaY1}
    color={PrimeColor.blue}
    width={0.15}
    tStart={-10}
    tEnd={10}
  />
  <ParameterizedFunction2D
    xFunc={HyperbolaX2}
    yFunc={HyperbolaY2}
    color={PrimeColor.blue}
    width={0.15}
    tStart={-10}
    tEnd={10}
  />
  <Latex2D
    latex="F_1"
    position={FocalPoint1}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.darkGreen}
  />
  <Latex2D
    latex="F_2"
    position={FocalPoint2}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.orange}
  />
  <Latex2D
    latex="C"
    position={Center}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.black}
  />
  <Latex2D
    latex="V_1"
    position={Vertex1}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.green}
  />
  <Latex2D
    latex="V_2"
    position={Vertex2}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.red}
  />
  <Latex2D
    latex="A"
    position={draggables[3].position}
    alignX="center"
    alignY="center"
    offset={new Vector2(0, 1.5 * off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.pink}
  />
  <Point2D position={Center} radius={0.3} />
  <Point2D position={Vertex1} radius={0.3} color={PrimeColor.green} />
</Canvas2D>
