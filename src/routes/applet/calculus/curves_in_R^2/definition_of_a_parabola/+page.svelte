<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import { toLatexText } from '$lib/utils/FormatString';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import { projectToParametrizedFunction2D } from '$lib/utils/MathLib';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import RightAngle2D from '$lib/d3/RightAngle2D.svelte';

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
    new Vector2(-20, -12), // bottom-left
    new Vector2(20, 12), // top-right
    0.5 // margin
  );
  const off = 0.6;

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
  const InitialFocalPoint = new Vector2(-9, 5);
  const InitialVertex = new Vector2(-2, 3);

  const draggables = [
    new Draggable(
      InitialFocalPoint,
      PrimeColor.darkGreen,
      undefined,
      SnapOthers,
      undefined,
      undefined,
      0.3,
      'square'
    ),
    new Draggable(InitialVertex, PrimeColor.red, undefined, SnapOthers, undefined, undefined, 0.3)
  ];

  const FocalPoint = $derived(draggables[0].position);
  const Vertex = $derived(draggables[1].position);
  const Normal = $derived(Vertex.clone().sub(FocalPoint));
  const Center = $derived(Normal.clone().multiplyScalar(2).add(FocalPoint));
  const DirectrixA = $derived(Normal.x);
  const DirectrixB = $derived(Normal.y);
  const DirectrixC = $derived(Normal.clone().dot(Center));
  const DirectrixDirection = $derived(new Vector2(-DirectrixB, DirectrixA));

  function ParabolaX(t: number): number {
    const p = FocalPoint.x;
    const q = FocalPoint.y;
    const a = DirectrixA;
    const b = DirectrixB;
    const c = -DirectrixC;
    const Vx = Vertex.x;
    const d = (a * p + b * q + c) / Math.sqrt(a ** 2 + b ** 2);
    return (
      Vx -
      (b / Math.sqrt(a ** 2 + b ** 2)) * t +
      ((a / Math.sqrt(a ** 2 + b ** 2)) * t ** 2) / (2 * d)
    );
  }
  function ParabolaY(t: number): number {
    const p = FocalPoint.x;
    const q = FocalPoint.y;
    const a = DirectrixA;
    const b = DirectrixB;
    const c = -DirectrixC;
    const Vy = Vertex.y;
    const d = (a * p + b * q + c) / Math.sqrt(a ** 2 + b ** 2);
    return (
      Vy +
      (a / Math.sqrt(a ** 2 + b ** 2)) * t +
      ((b / Math.sqrt(a ** 2 + b ** 2)) * t ** 2) / (2 * d)
    );
  }

  const tInit = -4;
  const xInit = ParabolaX(tInit);
  const yInit = ParabolaY(tInit);
  draggables.push(
    new Draggable(
      new Vector2(xInit, yInit),
      PrimeColor.pink,
      undefined,
      SnapToParabola,
      undefined,
      undefined,
      0.3,
      'diamond'
    )
  );

  const CurvePoint = $derived(draggables[2].position);
  const Distance = $derived(CurvePoint.clone().sub(FocalPoint).length());
  const DirectrixPoint = $derived(
    CurvePoint.clone().add(Normal.clone().normalize().multiplyScalar(Distance))
  );

  function SnapOthers(position: Vector2): Vector2 {
    draggables[2].value = SnapToParabola(draggables[2].position);
    return position;
  }
  function SnapToParabola(position: Vector2): Vector2 {
    const side = DirectrixDirection.clone().dot(position.clone().sub(Center));
    let projected: Vector2 | undefined;
    if (side > 0) {
      projected = projectToParametrizedFunction2D(ParabolaX, ParabolaY, position, 0, 30)[0];
    } else {
      projected = projectToParametrizedFunction2D(ParabolaX, ParabolaY, position, -30, 0)[0];
    }
    return projected;
  }
</script>

<Canvas2D
  {draggables}
  {initialViewBox}
  // legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <Latex2D
    latex={toLatexText('Axis')}
    position={FocalPoint}
    rotation={(Math.atan2(Normal.y, Normal.x) / Math.PI) * 180}
    offset={Normal.clone()
      .normalize()
      .multiplyScalar(-3 * off)}
    alignX="right"
    alignY="bottom"
  />
  <InfiniteLine2D
    origin={FocalPoint}
    direction={Normal}
    isDashed={true}
    width={0.08}
    overruledLength={100}
  />
  <Latex2D
    latex={toLatexText('Directrix')}
    position={Center}
    rotation={(Math.atan2(DirectrixDirection.y, DirectrixDirection.x) / Math.PI) * 180}
    offset={DirectrixDirection.clone()
      .normalize()
      .multiplyScalar(2 * off)}
    alignX="left"
    alignY="bottom"
  />
  <InfiniteLine2D origin={Center} direction={DirectrixDirection} isDashed={true} width={0.08} />
  <RightAngle2D
    vs={[Normal.clone().multiplyScalar(-1), DirectrixDirection]}
    origin={DirectrixPoint}
    size={1}
    lineWidth={0.08}
  />
  <Line2D start={FocalPoint} end={CurvePoint} color={PrimeColor.darkGreen} width={0.12} />
  <Line2D start={CurvePoint} end={DirectrixPoint} color={PrimeColor.orange} width={0.12} />
  <Circle2D
    position={CurvePoint}
    radius={Distance}
    color={PrimeColor.pink}
    isDashed={true}
    width={0.08}
  />
  <ParameterizedFunction2D
    xFunc={ParabolaX}
    yFunc={ParabolaY}
    color={PrimeColor.blue}
    width={0.15}
    tStart={-30}
    tEnd={30}
  />
  <Latex2D
    latex="F"
    position={FocalPoint}
    alignX="center"
    alignY="center"
    offset={new Vector2(0, Math.sqrt(2) * off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.darkGreen}
  />
  <Latex2D
    latex="V"
    position={Vertex}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.red}
  />
  <Latex2D
    latex="P"
    position={CurvePoint}
    alignX="center"
    alignY="center"
    offset={new Vector2(0, -1.5 * off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.pink}
  />
  <Latex2D
    latex="D"
    position={DirectrixPoint}
    alignX="center"
    alignY="center"
    offset={new Vector2(1.5 * off, 0)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.orange}
  />
  <Point2D position={DirectrixPoint} radius={0.3} color={PrimeColor.orange} />
  <!-- Remove at the end -->
  <Point2D position={Center} radius={0.3} />
</Canvas2D>
