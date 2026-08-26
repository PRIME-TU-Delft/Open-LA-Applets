<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { projectToImplicitFunction2D, projectToParametrizedFunction2D } from '$lib/utils/MathLib';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';

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

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-4 - 4 * 5, 2 - 4 * Math.sqrt(5 ** 2 - 4 ** 2)), // bottom-left
    new Vector2(-4 + 4 * 5, 2 + 4 * Math.sqrt(5 ** 2 - 4 ** 2)), // top-right
    1.5 // margin
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
  const InitialFocalPoint1 = new Vector2(-7, 2);
  const InitialFocalPoint2 = new Vector2(-1, 2);
  const InitCenter = InitialFocalPoint1.clone().add(InitialFocalPoint2).multiplyScalar(0.5);
  const InitA = 5;
  const InitDirection = InitialFocalPoint2.clone().sub(InitialFocalPoint1).normalize();
  const InitMajorPoint = InitCenter.clone().add(InitDirection.clone().multiplyScalar(InitA));
  const draggables = [
    new Draggable(
      InitialFocalPoint1,
      PrimeColor.orange,
      undefined,
      SnapFocalPoint,
      undefined,
      undefined,
      0.3
    ),
    new Draggable(
      InitialFocalPoint2,
      PrimeColor.darkGreen,
      undefined,
      SnapFocalPoint,
      undefined,
      undefined,
      0.3
    ),
    new Draggable(
      InitMajorPoint,
      PrimeColor.green,
      undefined,
      SnapMajorPoint,
      undefined,
      undefined,
      0.3
    )
  ];
  const FocalPoint1 = $derived(draggables[0].position);
  const FocalPoint2 = $derived(draggables[1].position);
  const Center = $derived(FocalPoint1.clone().add(FocalPoint2).multiplyScalar(0.5));
  const Direction = $derived(FocalPoint2.clone().sub(FocalPoint1).normalize());
  const ux = $derived(Direction.x);
  const uy = $derived(Direction.y);
  const vx = $derived(-uy);
  const vy = $derived(ux);
  const x0 = $derived(Center.x);
  const y0 = $derived(Center.y);
  const c = $derived(FocalPoint2.clone().sub(FocalPoint1).multiplyScalar(0.5).length());
  const a = $derived(draggables[2].position.clone().sub(Center).length());
  const b = $derived(Math.sqrt(a ** 2 - c ** 2));
  const Normal = $derived(new Vector2(vx, vy));
  const Vertex2 = $derived(draggables[2].position);
  const Vertex1 = $derived(Vertex2.clone().add(Direction.clone().multiplyScalar(-2 * a)));
  const CoVertex1 = $derived(Center.clone().add(Normal.clone().multiplyScalar(b)));
  const CoVertex2 = $derived(Center.clone().add(Normal.clone().multiplyScalar(-b)));
  function CurrentMajorAxisZeroFunction(x: number, y: number): number {
    return -uy * (x - x0) + ux * (y - y0);
  }
  function SnapMajorPoint(position: Vector2): Vector2 {
    let Projected = projectToImplicitFunction2D(CurrentMajorAxisZeroFunction, position);
    const t = Projected.clone().sub(Center).dot(Direction);
    if (t < c + 0.1) {
      Projected = FocalPoint2.clone().add(Direction.clone().multiplyScalar(0.1));
    }
    draggables[3].value = SnapToEllipse(draggables[3].position);
    return Projected;
  }
  function SnapFocalPoint(position: Vector2): Vector2 {
    // no real snap, but update position of MajorPoint
    draggables[2].value = SnapMajorPoint(draggables[2].position);
    draggables[3].value = SnapToEllipse(draggables[3].position);
    return position;
  }
  function ParamX(t: number): number {
    return x0 + a * ux * Math.cos(t) + b * vx * Math.sin(t);
  }
  function ParamY(t: number): number {
    return y0 + a * uy * Math.cos(t) + b * vy * Math.sin(t);
  }
  const InitTheta = (1 / 6) * Math.PI;
  const InitX = ParamX(InitTheta);
  const InitY = ParamY(InitTheta);
  const InitEllipsePoint = new Vector2(InitX, InitY);
  draggables.push(
    new Draggable(
      InitEllipsePoint,
      PrimeColor.pink,
      undefined,
      SnapToEllipse,
      undefined,
      undefined,
      0.3
    )
  );
  function SnapToEllipse(position: Vector2): Vector2 {
    return projectToParametrizedFunction2D(ParamX, ParamY, position, 0, 2 * Math.PI)[0];
  }
</script>

<Canvas2D
  {draggables}
  {initialViewBox}
  legendItems={[new LegendItem(toLatexText('Ellipse'), PrimeColor.blue)]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {@const off = 0.6}
  {@const Segment1 = draggables[3].position.clone().sub(FocalPoint1)}
  {@const Segment2 = draggables[3].position.clone().sub(FocalPoint2)}
  {@const Length1 = Segment1.length()}
  {@const Length2 = Segment2.length()}
  {@const Addition1 = Segment1.clone().normalize().multiplyScalar(Length2)}
  {@const Addition2 = Segment2.clone().normalize().multiplyScalar(Length1)}
  <Latex2D
    latex={toLatexText('Major axis')}
    position={Vertex2}
    rotation={(Math.atan2(uy, ux) / Math.PI) * 180}
    offset={Direction.clone().multiplyScalar(off)}
    alignX="left"
    alignY="bottom"
  />
  <InfiniteLine2D origin={Center} direction={Direction} isDashed={true} width={0.08} />
  <Latex2D
    latex={toLatexText('Minor axis')}
    position={CoVertex1}
    rotation={(Math.atan2(vy, vx) / Math.PI) * 180}
    offset={Normal.clone().multiplyScalar(off)}
    alignX="left"
    alignY="bottom"
  />
  <InfiniteLine2D origin={Center} direction={new Vector2(vx, vy)} isDashed={true} width={0.08} />
  <Circle2D
    position={FocalPoint1}
    radius={Length1 + Length2}
    color={PrimeColor.orange}
    isDashed={true}
    width={0.08}
  />
  <Circle2D
    position={FocalPoint2}
    radius={Length1 + Length2}
    color={PrimeColor.darkGreen}
    isDashed={true}
    width={0.08}
  />
  <Line2D start={FocalPoint1} end={draggables[3].position} color={PrimeColor.orange} width={0.12} />
  <Line2D
    start={FocalPoint2}
    end={draggables[3].position}
    color={PrimeColor.darkGreen}
    width={0.12}
  />
  <Line2D
    start={draggables[3].position.clone().add(Addition2)}
    end={draggables[3].position}
    color={PrimeColor.orange}
    width={0.12}
    isDashed={true}
  />
  <Line2D
    start={draggables[3].position.clone().add(Addition1)}
    end={draggables[3].position}
    color={PrimeColor.darkGreen}
    width={0.12}
    isDashed={true}
  />
  <Point2D
    position={draggables[3].position.clone().add(Addition1)}
    color={PrimeColor.orange}
    shape="square"
    radius={0.2}
  />
  <Point2D
    position={draggables[3].position.clone().add(Addition2)}
    color={PrimeColor.darkGreen}
    shape="square"
    radius={0.2}
  />
  <ParameterizedFunction2D
    xFunc={ParamX}
    yFunc={ParamY}
    color={PrimeColor.blue}
    tStart={0}
    tEnd={2 * Math.PI}
    width={0.15}
  />
  <Latex2D
    latex="F_1"
    position={FocalPoint1}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.orange}
  />
  <Latex2D
    latex="F_2"
    position={FocalPoint2}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.darkGreen}
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
    color={PrimeColor.red}
  />
  <Latex2D
    latex="V_2"
    position={Vertex2}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.green}
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
  <Latex2D
    latex="W_1"
    position={CoVertex1}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.yellow}
  />
  <Latex2D
    latex="W_2"
    position={CoVertex2}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.cyan}
  />
  <Point2D position={Center} radius={0.3} />
  <Point2D position={Vertex1} radius={0.3} color={PrimeColor.red} />
  <Point2D position={CoVertex1} radius={0.3} color={PrimeColor.yellow} shape="triangle" />
  <Point2D position={CoVertex2} radius={0.3} color={PrimeColor.cyan} shape="triangle" />
</Canvas2D>
