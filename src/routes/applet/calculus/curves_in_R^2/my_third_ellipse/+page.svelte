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
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';
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
  const InitX0 = 0;
  const InitY0 = 0;
  const InitA = 5;
  const InitB = 4;
  initialViewBox = new ViewBox(
    new Vector2(InitX0 - 2 * InitA, InitY0 - 2 * InitB), // bottom-left
    new Vector2(InitX0 + 2 * InitA, InitY0 + 2 * InitB), // top-right
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
  const initVertex2 = new Vector2(InitA, 0);
  const initCoVertex1 = new Vector2(0, InitB);
  const draggables = [
    new Draggable(
      initVertex2,
      PrimeColor.green,
      undefined,
      SnaptoXPositiveAxis,
      undefined,
      undefined,
      0.3
    ),
    new Draggable(
      initCoVertex1,
      PrimeColor.yellow,
      undefined,
      SnaptoYPositiveAxis,
      undefined,
      undefined,
      0.3,
      'triangle'
    )
  ];
  function SnaptoXPositiveAxis(p: Vector2): Vector2 {
    return new Vector2(Math.max(Math.sqrt(0.01 + CoVertex1.y ** 2), p.x), 0);
  }
  function SnaptoYPositiveAxis(p: Vector2): Vector2 {
    return new Vector2(
      0,
      Math.max(Math.min(currentA - 0.1, p.y), Math.sqrt(0.2 * currentA - 0.01))
    );
  }
  const Vertex1 = $derived(draggables[0].position.clone().multiplyScalar(-1));
  const Vertex2 = $derived(draggables[0].position);
  const CoVertex1 = $derived(draggables[1].position);
  const CoVertex2 = $derived(draggables[1].position.clone().multiplyScalar(-1));
  const currentA = $derived(Vertex2.x);
  const currentB = $derived(CoVertex1.y);
  const currentC = $derived(Math.sqrt(currentA ** 2 - currentB ** 2));
  const FocalPoint1 = $derived(new Vector2(-currentC, 0));
  const FocalPoint2 = $derived(new Vector2(currentC, 0));
  function ParamX(t: number): number {
    return currentA * Math.cos(t);
  }
  function ParamY(t: number): number {
    return currentB * Math.sin(t);
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
  {@const off = 0.8}
  <Latex2D
    latex="V_1(-a,0)"
    position={Vertex1}
    alignX="right"
    alignY="center"
    offset={new Vector2(0, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.red}
  />
  <Latex2D
    latex="V_2(a,0)"
    position={Vertex2}
    alignX="left"
    alignY="center"
    offset={new Vector2(0, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.green}
  />
  <Latex2D
    latex="W_1(b,0)"
    position={CoVertex1}
    alignX="left"
    alignY="center"
    offset={new Vector2(0, off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.yellow}
  />
  <Latex2D
    latex="W_2(-b,0)"
    position={CoVertex2}
    alignX="left"
    alignY="center"
    offset={new Vector2(0, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.cyan}
  />
  <Latex2D
    latex="F_1(-c,0)"
    position={FocalPoint1}
    alignX="center"
    alignY="center"
    offset={new Vector2(0, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.orange}
  />
  <Latex2D
    latex="F_2(c,0)"
    position={FocalPoint2}
    alignX="center"
    alignY="center"
    offset={new Vector2(0, -off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.darkGreen}
  />
  <ParameterizedFunction2D
    xFunc={ParamX}
    yFunc={ParamY}
    color={PrimeColor.blue}
    tStart={0}
    tEnd={2 * Math.PI}
    width={0.15}
  />
  <Line2D start={new Vector2(0, 0)} end={FocalPoint2} width={0.08} color={PrimeColor.darkGreen} />
  <Latex2D
    latex="c"
    position={new Vector2(currentC / 2, 0)}
    alignX="center"
    alignY="center"
    background={PrimeColor.white}
    color={PrimeColor.darkGreen}
    offset={new Vector2(0, 0.3)}
  />
  <Line2D start={new Vector2(0, 0)} end={CoVertex1} width={0.08} color={PrimeColor.yellow} />
  <Latex2D
    latex="b"
    position={new Vector2(0, currentB / 2)}
    alignX="center"
    alignY="center"
    background={PrimeColor.white}
    color={PrimeColor.yellow}
    offset={new Vector2(0, 0.3)}
  />
  <Line2D start={FocalPoint2} end={CoVertex1} width={0.08} color={PrimeColor.pink} />
  <Latex2D
    latex="a"
    position={new Vector2(currentC / 2, currentB / 2)}
    alignX="center"
    alignY="center"
    background={PrimeColor.white}
    color={PrimeColor.pink}
    offset={new Vector2(0, 0.3)}
  />
  <Point2D position={Vertex1} radius={0.3} color={PrimeColor.red} />
  <Point2D position={CoVertex2} radius={0.3} color={PrimeColor.cyan} shape="triangle" />
  <Point2D position={FocalPoint1} radius={0.3} color={PrimeColor.orange} />
  <Point2D position={FocalPoint2} radius={0.3} color={PrimeColor.darkGreen} />
  <Point2D position={new Vector2(0, 0)} radius={0.3} color={PrimeColor.black} />
</Canvas2D>
