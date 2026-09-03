<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import { toLatexText } from '$lib/utils/FormatString';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';

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
    new Vector2(-12, -12), // bottom-left
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
    skipX: 1,
    skipY: 1
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
  const InitialFocalPoint = new Vector2(1, 5);
  const InitialVertex = new Vector2(1, 6);

  const Normal = InitialVertex.clone().sub(InitialFocalPoint);
  const Center = Normal.clone().multiplyScalar(2).add(InitialFocalPoint);
  const DirectrixA = Normal.x;
  const DirectrixB = Normal.y;
  const DirectrixC = Normal.clone().dot(Center);
  const DirectrixDirection = new Vector2(-DirectrixB, DirectrixA);

  function ParabolaX(t: number): number {
    const p = InitialFocalPoint.x;
    const q = InitialFocalPoint.y;
    const a = DirectrixA;
    const b = DirectrixB;
    const c = -DirectrixC;
    const Vx = InitialVertex.x;
    const d = (a * p + b * q + c) / Math.sqrt(a ** 2 + b ** 2);
    return (
      Vx -
      (b / Math.sqrt(a ** 2 + b ** 2)) * t +
      ((a / Math.sqrt(a ** 2 + b ** 2)) * t ** 2) / (2 * d)
    );
  }
  function ParabolaY(t: number): number {
    const p = InitialFocalPoint.x;
    const q = InitialFocalPoint.y;
    const a = DirectrixA;
    const b = DirectrixB;
    const c = -DirectrixC;
    const Vy = InitialFocalPoint.y;
    const d = (a * p + b * q + c) / Math.sqrt(a ** 2 + b ** 2);
    return (
      Vy +
      (a / Math.sqrt(a ** 2 + b ** 2)) * t +
      ((b / Math.sqrt(a ** 2 + b ** 2)) * t ** 2) / (2 * d)
    );
  }
</script>

<Canvas2D
  {initialViewBox}
  legendItems={[
    new LegendItem('f(x)=-\\frac{1}{4}x^2+\\frac{1}{2}x+\\frac{23}{4}', PrimeColor.blue)
  ]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <Latex2D
    latex={toLatexText('Axis')}
    position={InitialFocalPoint}
    rotation={(Math.atan2(Normal.y, Normal.x) / Math.PI) * 180}
    offset={Normal.clone()
      .normalize()
      .multiplyScalar(-3 * off)}
    alignX="right"
    alignY="bottom"
  />
  <InfiniteLine2D
    origin={InitialFocalPoint}
    direction={Normal}
    isDashed={true}
    width={0.08}
    overruledLength={100}
  />
  <Latex2D
    latex={toLatexText('Directrix')}
    position={Center}
    offset={DirectrixDirection.clone()
      .normalize()
      .multiplyScalar(-2 * off)}
    alignX="left"
    alignY="bottom"
  />
  <InfiniteLine2D origin={Center} direction={DirectrixDirection} isDashed={true} width={0.08} />
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
    position={InitialFocalPoint}
    alignX="center"
    alignY="center"
    offset={new Vector2(off, -Math.sqrt(2) * off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.darkGreen}
  />
  <Latex2D
    latex="V"
    position={InitialVertex}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.red}
  />
  <Point2D position={InitialFocalPoint} color={PrimeColor.darkGreen} radius={0.3} shape="square" />
  <Point2D position={InitialVertex} color={PrimeColor.red} radius={0.3} shape="circle" />
</Canvas2D>
