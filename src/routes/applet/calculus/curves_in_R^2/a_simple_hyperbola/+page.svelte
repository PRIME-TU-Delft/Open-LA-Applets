<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    ParameterizedFunctionFragment,
    Point
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
  import { Controls } from '$lib/controls/Controls';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
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

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-5, -5), // bottom-left
    new Vector2(5, 5), // top-right
    0 // margin
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
  const Vertex1 = new Vector2(-1, -1);
  const Vertex2 = new Vector2(1, 1);
  const FocalPoint1 = new Vector2(-Math.sqrt(2), -Math.sqrt(2));
  const FocalPoint2 = new Vector2(Math.sqrt(2), Math.sqrt(2));
  const Center = FocalPoint1.clone().add(FocalPoint2).multiplyScalar(0.5);
  const MajorDirection = FocalPoint2.clone().sub(FocalPoint1).normalize();
  const MinorDirection = new Vector2(-MajorDirection.y, MajorDirection.x);
  const x0 = Center.x;
  const y0 = Center.y;
  const A = $derived(Vertex2.clone().sub(Center).length());
  const C = $derived(FocalPoint1.clone().sub(FocalPoint2).multiplyScalar(0.5).length());
  const B = $derived(Math.sqrt(C ** 2 - A ** 2));
  const off = 0.4;

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
  const appletObjects: AppletObject[] = [
    new ParameterizedFunctionFragment(HyperbolaX1, HyperbolaY1, PrimeColor.blue, {
      width: 0.08,
      legendText: toLatexText('Hyperbola'),
      tStart: -10,
      tEnd: 10
    }),
    new ParameterizedFunctionFragment(HyperbolaX2, HyperbolaY2, PrimeColor.blue, {
      width: 0.08,
      tStart: -10,
      tEnd: 10
    }),
    new Point(Vertex1, PrimeColor.green, { shape: 'circle', radius: 0.15 }),
    new Point(Vertex2, PrimeColor.red, { shape: 'circle', radius: 0.15 }),
    new Point(FocalPoint1, PrimeColor.darkGreen, { shape: 'square', radius: 0.15 }),
    new Point(FocalPoint2, PrimeColor.orange, { shape: 'triangle', radius: 0.15 })
  ];

  const initT = -2;
  const finalT = 2;
  const state = {
    t: initT
  };

  type S = typeof state;

  const transitions: SlideShowSteps<S> = [
    // Step 1: t increases with finalT - initT
    {
      transition: (t: number, state: S) => {
        state.t = initT + t * (finalT - initT);
        return {
          state,
          labelPrev: toLatexText('Animate parametrisations'),
          labelNext: toLatexText('Reverse parametrisations')
        };
      },
      duration: 2000,
      timeSteps: 500
    }
  ];

  const controls = Controls.addSlideShow(
    state,
    transitions,
    toLatexText('Animate parametrisations')
  );

  const currentT = $derived(controls[0].t);
</script>

<Canvas2D
  {controls}
  legendItems={getLegend(appletObjects)}
  {initialViewBox}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  legendFormulaPosition="top-left"
>
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
  <Latex2D
    latex="V_1"
    position={Vertex1}
    alignX="center"
    alignY="center"
    offset={new Vector2(0, off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.green}
  />
  <Latex2D
    latex="V_2"
    position={Vertex2}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, 0)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.red}
  />
  <Latex2D
    latex="F_1"
    position={FocalPoint1}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.darkGreen}
  />
  <Latex2D
    latex="F_2"
    position={FocalPoint2}
    alignX="center"
    alignY="center"
    offset={new Vector2(-off, off)}
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
    color={PrimeColor.orange}
  />
  <TemplateComponent objects={[appletObjects[0], appletObjects[1]]} />
  <ParameterizedFunction2D
    xFunc={HyperbolaX1}
    yFunc={HyperbolaY1}
    color={PrimeColor.pink}
    isDashed={true}
    tStart={initT}
    tEnd={currentT}
    width={0.09}
  />
  <ParameterizedFunction2D
    xFunc={HyperbolaX2}
    yFunc={HyperbolaY2}
    color={PrimeColor.purple}
    isDashed={true}
    tStart={initT}
    tEnd={currentT}
    width={0.09}
  />
  <TemplateComponent
    objects={[appletObjects[2], appletObjects[3], appletObjects[4], appletObjects[5]]}
  />
  <Point2D
    position={new Vector2(HyperbolaX1(currentT), HyperbolaY1(currentT))}
    radius={0.15}
    color={PrimeColor.pink}
  />
  <Point2D
    position={new Vector2(HyperbolaX2(currentT), HyperbolaY2(currentT))}
    radius={0.15}
    color={PrimeColor.purple}
  />
</Canvas2D>
