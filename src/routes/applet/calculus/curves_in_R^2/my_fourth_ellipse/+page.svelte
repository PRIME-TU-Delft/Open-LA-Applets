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
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import { Controls } from '$lib/controls/Controls';
  import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
  import Angle2D from '$lib/d3/Angle2D.svelte';

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
  const InitA = 7;
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
  xAxisLabel = 'x-x_0';
  yAxisLabel = 'y-y_0';

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
  function ParamX(t: number): number {
    return currentA * Math.cos(t);
  }
  function ParamY(t: number): number {
    return currentB * Math.sin(t);
  }

  const initTheta = Math.PI / 3.1;
  const state = {
    theta: initTheta
  };

  type S = typeof state;

  const transitions: SlideShowSteps<S> = [
    // Step 1: theta increases with 2 pi
    {
      transition: (t: number, state: S) => {
        state.theta = initTheta + t * 2 * Math.PI;
        return {
          state,
          labelPrev: toLatexText('Start drawing'),
          labelNext: toLatexText('Reverse drawing')
        };
      },
      duration: 5000,
      timeSteps: 500
    }
  ];

  const controls = Controls.addSlideShow(state, transitions, toLatexText('Start drawing'));
</script>

<Canvas2D
  {controls}
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
    alignX="center"
    alignY="center"
    offset={new Vector2(0, off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.yellow}
  />
  <Latex2D
    latex="W_2(-b,0)"
    position={CoVertex2}
    alignX="center"
    alignY="center"
    offset={new Vector2(0, off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.cyan}
  />
  <Circle2D radius={currentA} width={0.08} color={PrimeColor.darkGreen} />
  <Circle2D radius={currentB} width={0.08} color={PrimeColor.orange} />
  <ParameterizedFunction2D
    xFunc={ParamX}
    yFunc={ParamY}
    color={PrimeColor.blue}
    tStart={initTheta}
    tEnd={controls[0].theta}
    width={0.15}
  />
  <Latex2D
    latex="C"
    position={new Vector2(0, 0)}
    alignX="center"
    alignY="center"
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.black}
    offset={new Vector2(-off / Math.sqrt(2), -off / Math.sqrt(2))}
  />
  {@const PointA = new Vector2(ParamX(controls[0].theta), currentA * Math.sin(controls[0].theta))}
  {@const PointB = new Vector2(currentB * Math.cos(controls[0].theta), ParamY(controls[0].theta))}
  {@const PointP = new Vector2(PointA.x, PointB.y)}
  {@const PointC = new Vector2(Math.sqrt(currentA ** 2 - PointB.y ** 2), PointB.y)}
  {@const PointD = new Vector2(-Math.sqrt(currentA ** 2 - PointB.y ** 2), PointB.y)}
  {@const PointE = new Vector2(ParamX(controls[0].theta), -currentA * Math.sin(controls[0].theta))}
  <Line2D
    start={new Vector2(0, 0)}
    end={new Vector2(PointP.x, 0)}
    color={PrimeColor.darkGreen}
    width={0.12}
  />
  <Line2D
    start={new Vector2(0, 0)}
    end={new Vector2(0, PointP.y)}
    color={PrimeColor.orange}
    width={0.12}
  />
  <Line2D start={new Vector2(0, 0)} end={PointA} color={PrimeColor.black} width={0.1} />
  <Line2D start={PointD} end={PointC} isDashed width={0.05} />
  <Line2D start={PointE} end={PointA} isDashed width={0.05} />
  <Latex2D
    latex="P"
    position={PointP}
    alignX="center"
    alignY="center"
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.raspberry}
    offset={new Vector2(off / Math.sqrt(2), -off / Math.sqrt(2))}
  />
  <Latex2D
    latex="A"
    position={PointA}
    alignX="center"
    alignY="center"
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.darkGreen}
    offset={new Vector2(off / Math.sqrt(2), off / Math.sqrt(2))}
  />
  <Latex2D
    latex="B"
    position={PointB}
    alignX="center"
    alignY="center"
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.orange}
    offset={new Vector2(-off / Math.sqrt(2), off / Math.sqrt(2))}
  />
  <Angle2D
    color={PrimeColor.raspberry}
    startAngle={0}
    endAngle={controls[0].theta}
    hasHead
    distance={2}
    width={0.08}
  />
  <Latex2D
    latex="t"
    position={new Vector2(2 * Math.cos(controls[0].theta / 2), 2 * Math.sin(controls[0].theta / 2))}
    alignX="center"
    alignY="center"
    background={PrimeColor.white}
    color={PrimeColor.raspberry}
    offset={new Vector2(0, 0)}
  />
  <Latex2D
    latex="a\cos(t)"
    position={new Vector2(PointP.x / 2, 0)}
    alignX="center"
    alignY="center"
    background={PrimeColor.white}
    color={PrimeColor.darkGreen}
    offset={new Vector2(0, -off)}
  />
  <Latex2D
    latex="b\sin(t)"
    position={new Vector2(0, PointP.y / 2)}
    alignX="center"
    alignY="center"
    background={PrimeColor.white}
    color={PrimeColor.orange}
    offset={new Vector2(-off, 0)}
    rotation={90}
  />
  <Point2D position={Vertex1} radius={0.3} color={PrimeColor.red} />
  <Point2D position={CoVertex2} radius={0.3} color={PrimeColor.cyan} shape="triangle" />
  <Point2D position={new Vector2(0, 0)} radius={0.3} color={PrimeColor.black} />
  <Point2D position={PointA} radius={0.3} color={PrimeColor.darkGreen} />
  <Point2D position={PointB} radius={0.3} color={PrimeColor.orange} />
  <Point2D position={PointP} radius={0.3} color={PrimeColor.raspberry} />
</Canvas2D>
