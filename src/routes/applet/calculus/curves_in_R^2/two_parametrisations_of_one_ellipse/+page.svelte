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
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
  import { Controls } from '$lib/controls/Controls';
  import Point2D from '$lib/d3/Point2D.svelte';

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
    new Vector2(-4, 1), // bottom-left
    new Vector2(2, 9), // top-right
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
  const Vertex1 = new Vector2(-1, 2);
  const Vertex2 = new Vector2(-1, 8);
  const CoVertex1 = new Vector2(-3, 5);
  const CoVertex2 = new Vector2(1, 5);
  // assuming above are the true vertices and co-vertices, the next is
  const Center = Vertex2.clone().add(Vertex1).multiplyScalar(0.5);
  const x0 = Center.x;
  const y0 = Center.y;
  const SemiAxis1 = CoVertex2.clone().sub(Center);
  const SemiAxis2 = Vertex2.clone().sub(Center);
  const off = 0.4;
  function ParamX1(t: number): number {
    return x0 + SemiAxis1.x * Math.cos(t) + SemiAxis2.x * Math.sin(t);
  }
  function ParamY1(t: number): number {
    return y0 + SemiAxis1.y * Math.cos(t) + SemiAxis2.y * Math.sin(t);
  }
  function ParamX2(t: number): number {
    return x0 + SemiAxis1.x * Math.sin(2 * t) + SemiAxis2.x * Math.cos(2 * t);
  }
  function ParamY2(t: number): number {
    return y0 + SemiAxis1.y * Math.sin(2 * t) + SemiAxis2.y * Math.cos(2 * t);
  }
  const appletObjects: AppletObject[] = [
    new ParameterizedFunctionFragment(ParamX1, ParamY1, PrimeColor.blue, {
      tStart: 0,
      tEnd: 2 * Math.PI,
      legendText: toLatexText('Ellipse'),
      width: 0.08
    }),
    new Point(Vertex1, PrimeColor.red, {
      shape: 'circle',
      radius: 0.15
    }),
    new Point(Vertex2, PrimeColor.green, {
      shape: 'circle',
      radius: 0.15
    }),
    new Point(CoVertex1, PrimeColor.yellow, {
      shape: 'triangle',
      radius: 0.15
    }),
    new Point(CoVertex2, PrimeColor.cyan, {
      shape: 'triangle',
      radius: 0.15
    })
  ];

  const initTheta = 0;
  const state = {
    theta: initTheta
  };

  type S = typeof state;

  const transitions: SlideShowSteps<S> = [
    // Step 1: theta increases with 2 pi
    {
      transition: (t: number, state: S) => {
        state.theta = initTheta + t * (2 * Math.PI - initTheta);
        return {
          state,
          labelPrev: toLatexText('Animate parametrisations'),
          labelNext: toLatexText('Reverse parametrisations')
        };
      },
      duration: 5000,
      timeSteps: 500
    }
  ];

  const controls = Controls.addSlideShow(
    state,
    transitions,
    toLatexText('Animate parametrisations')
  );
  const currentT = $derived(controls[0].theta);
</script>

<CanvasGrid columns={2} rows={1} {controls} legendItems={getLegend(appletObjects)}>
  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <Latex2D
      latex="V_1"
      position={Vertex1}
      alignX="center"
      alignY="center"
      offset={new Vector2(0, -off)}
      background={PrimeColor.white + PrimeColor.opacity(0.5)}
      color={PrimeColor.red}
    />
    <Latex2D
      latex="V_2"
      position={Vertex2}
      alignX="center"
      alignY="center"
      offset={new Vector2(0, off)}
      background={PrimeColor.white + PrimeColor.opacity(0.5)}
      color={PrimeColor.green}
    />
    <Latex2D
      latex="W_1"
      position={CoVertex1}
      alignX="center"
      alignY="center"
      offset={new Vector2(-off, 0)}
      background={PrimeColor.white + PrimeColor.opacity(0.5)}
      color={PrimeColor.yellow}
    />
    <Latex2D
      latex="W_2"
      position={CoVertex2}
      alignX="center"
      alignY="center"
      offset={new Vector2(off, 0)}
      background={PrimeColor.white + PrimeColor.opacity(0.5)}
      color={PrimeColor.cyan}
    />
    <TemplateComponent objects={appletObjects} />
    {#if currentT - initTheta <= Math.PI}
      <ParameterizedFunction2D
        xFunc={ParamX1}
        yFunc={ParamY1}
        color={PrimeColor.pink}
        isDashed={true}
        tStart={initTheta}
        tEnd={currentT}
        width={0.09}
      />
      <Point2D
        position={new Vector2(ParamX1(currentT), ParamY1(currentT))}
        radius={0.15}
        color={PrimeColor.pink}
      />
    {/if}
    {#if currentT - initTheta >= Math.PI}
      <ParameterizedFunction2D
        xFunc={ParamX1}
        yFunc={ParamY1}
        color={PrimeColor.pink}
        isDashed={true}
        tStart={initTheta}
        tEnd={Math.PI + initTheta}
        width={0.09}
      />
      <ParameterizedFunction2D
        xFunc={ParamX1}
        yFunc={ParamY1}
        color={PrimeColor.purple}
        isDashed={true}
        tStart={Math.PI + initTheta}
        tEnd={currentT}
        width={0.09}
      />
      <Point2D
        position={new Vector2(ParamX1(currentT), ParamY1(currentT))}
        radius={0.15}
        color={PrimeColor.purple}
      />
    {/if}
  </GridCanvas2D>
  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <Latex2D
      latex="V_1"
      position={Vertex1}
      alignX="center"
      alignY="center"
      offset={new Vector2(0, -off)}
      background={PrimeColor.white + PrimeColor.opacity(0.5)}
      color={PrimeColor.red}
    />
    <Latex2D
      latex="V_2"
      position={Vertex2}
      alignX="center"
      alignY="center"
      offset={new Vector2(0, off)}
      background={PrimeColor.white + PrimeColor.opacity(0.5)}
      color={PrimeColor.green}
    />
    <Latex2D
      latex="W_1"
      position={CoVertex1}
      alignX="center"
      alignY="center"
      offset={new Vector2(-off, 0)}
      background={PrimeColor.white + PrimeColor.opacity(0.5)}
      color={PrimeColor.yellow}
    />
    <Latex2D
      latex="W_2"
      position={CoVertex2}
      alignX="center"
      alignY="center"
      offset={new Vector2(off, 0)}
      background={PrimeColor.white + PrimeColor.opacity(0.5)}
      color={PrimeColor.cyan}
    />
    <TemplateComponent objects={appletObjects} />
    {#if currentT - initTheta <= Math.PI}
      <ParameterizedFunction2D
        xFunc={ParamX2}
        yFunc={ParamY2}
        color={PrimeColor.pink}
        isDashed={true}
        tStart={initTheta}
        tEnd={currentT}
        width={0.09}
      />
      <Point2D
        position={new Vector2(ParamX2(currentT), ParamY2(currentT))}
        radius={0.15}
        color={PrimeColor.pink}
      />
    {/if}
    {#if currentT - initTheta >= Math.PI}
      <ParameterizedFunction2D
        xFunc={ParamX2}
        yFunc={ParamY2}
        color={PrimeColor.pink}
        isDashed={true}
        tStart={initTheta}
        tEnd={Math.PI + initTheta}
        width={0.09}
      />
      <ParameterizedFunction2D
        xFunc={ParamX2}
        yFunc={ParamY2}
        color={PrimeColor.purple}
        isDashed={true}
        tStart={Math.PI + initTheta}
        tEnd={currentT}
        width={0.09}
      />
      <Point2D
        position={new Vector2(ParamX2(currentT), ParamY2(currentT))}
        radius={0.15}
        color={PrimeColor.purple}
      />
    {/if}
  </GridCanvas2D>
</CanvasGrid>
