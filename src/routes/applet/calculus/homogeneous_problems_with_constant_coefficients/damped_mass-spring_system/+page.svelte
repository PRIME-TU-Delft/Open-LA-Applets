<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import MassSpring2D from '$lib/d3/MassSpring2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { AppletObject, Polygon } from '$lib/template/TemplateAppletObjects';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import { Controls } from '$lib/controls/Controls';
  import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
  import { toLatexText } from '$lib/utils/FormatString';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import FillBetweenFunctions2D from '$lib/d3/FillBetweenFunctions2D.svelte';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import ImplicitFunction2D from '$lib/d3/ImplicitFunction2D.svelte';
  import { findMinMax } from '$lib/utils/MathLib';

  let initialViewBox: ViewBox | undefined;
  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;
  let axis: AxisProps | undefined;
  let axis2: AxisProps | undefined;
  let axis3: AxisProps | undefined;

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
    new Vector2(-1.5, -3.25), // bottom-left
    new Vector2(4, 4), // top-right
    0 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: false,
    showAxisNumbersX: false,
    showAxisNumbersY: false,
    logarithmicX: false,
    logarithmicY: false,
    skipX: -1,
    skipY: 0,
    showAxisX: false
  };
  axis2 = {
    showOrigin: false,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: 3,
    skipY: 1,
    showAxisX: true,
    showAxisY: true,
    colorX: PrimeColor.raspberry,
    colorY: PrimeColor.red
  };
  axis3 = {
    showOrigin: false,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: 1,
    skipY: 0,
    showAxisX: true,
    showAxisY: true
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
  xAxisLabel = '';
  yAxisLabel = '';
  const draggables = [
    new Draggable(
      new Vector2(0, 5),
      PrimeColor.darkGreen,
      undefined,
      SnapToGrid,
      undefined,
      undefined,
      0.2
    )
  ];
  const maxRadius = 26 / 80;
  function findMaxAmplitude(A: number, B: number): { min: number; max: number } {
    const c1 = (9 * A + B) / 5;
    const c2 = (-4 * A - B) / 5;
    const boundsU = findMinMax((t) => c1 * Math.exp(-4 * t) + c2 * Math.exp(-9 * t), 0, 5);
    return { min: boundsU.min, max: boundsU.max };
  }
  function findMaxSpeed(A: number): { min: number; max: number } {
    let floatArrayB: number[] = [];
    let currentB = -30;
    let stepB = 0.1;
    let allowedB = [];
    for (let i = 0; i < 600; i++) {
      floatArrayB.push(currentB);
      currentB += stepB;
      // calculate the bounds of u(t) for this A and B
      const boundsU = findMaxAmplitude(A, currentB);
      // if bounds for u(t) acceptable, store B
      if (boundsU.min >= -maxRadius && boundsU.max <= maxRadius) {
        allowedB.push(currentB);
      }
    }
    // find minimum and maximum allowed B's
    return { min: Math.min(...allowedB), max: Math.max(...allowedB) };
  }
  function SnapToGrid(position: Vector2): Vector2 {
    const snappedX = Math.min(Math.max(Number(position.x.toFixed(2)), -maxRadius), maxRadius);
    const boundsY = findMaxSpeed(snappedX);
    const snappedY = Math.min(Math.max(Number(position.y.toFixed(1)), boundsY.min), boundsY.max);
    return new Vector2(snappedX, snappedY);
  }

  function zeroFunction(A: number, B: number): number {
    const Bounds = findMaxAmplitude(A, B);
    const maxAbsBound = Math.max(Math.abs(Bounds.min), Math.abs(Bounds.max));
    return maxAbsBound - maxRadius;
  }

  const r = 6;

  const state = {
    time: 0
  };

  type S = typeof state;

  const transitions: SlideShowSteps<S> = [
    // Step 1: time increases to 5
    {
      transition: (t: number, state: S) => {
        state.time = 5 * t;
        return {
          state,
          labelPrev: toLatexText('Initial state'),
          labelNext: toLatexText('Final state')
        };
      },
      duration: 5000,
      timeSteps: 500
    }
  ];

  const controls = Controls.addSlideShow(state, transitions, toLatexText('Initial state'));

  const floatArray: number[] = Array.from({ length: 61 }, (_, i) => (-30 + i) / 8);

  const appletObjects: AppletObject[] = [
    new Polygon(
      [new Vector2(0.75, 4), new Vector2(3.25, 4), new Vector2(3.25, -3), new Vector2(0.75, -3)],
      PrimeColor.grey
    )
  ];
</script>

<CanvasGrid rows={2} columns={2} {controls}>
  <GridCanvas2D
    {initialViewBox}
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
    gridColumn="1"
    gridRow="1"
  >
    {@const A = draggables[0].position.x}
    {@const B = draggables[0].position.y}
    {@const c1 = (9 * A + B) / 5}
    {@const c2 = (-4 * A - B) / 5}
    {@const time = controls[0].time}
    <InfiniteLine2D
      direction={new Vector2(1, 0)}
      color={PrimeColor.black + PrimeColor.opacity(0.5)}
    />
    <Vector2D
      color={PrimeColor.black}
      origin={new Vector2(-1.3, -0.5)}
      direction={new Vector2(0, -1)}
    />
    <MassSpring2D
      center={2}
      ceilingTop={4.2}
      massLocation={-1 * (4 / 0.5) * (c1 * Math.exp(-4 * time) + c2 * Math.exp(-9 * time))}
    />
    <Latex2D
      latex="u"
      color={PrimeColor.black}
      position={new Vector2(-1.6, -0.8)}
      alignX="center"
      alignY="center"
    />
    {#each floatArray as y, _i (y)}
      <Latex2D
        latex={(-y).toFixed(3)}
        color={PrimeColor.black}
        position={new Vector2(-0.15, y * 8 + 0.05)}
        alignX="right"
        alignY="center"
        background={PrimeColor.white}
      />
    {/each}
    <FillBetweenFunctions2D
      func1={(_x: number) => -3}
      func2={(x: number) => 4}
      color1={PrimeColor.blue}
      color2={PrimeColor.raspberry}
      width={0.05}
      xMin={0}
      xMax={0}
      integral={{
        xLeft: 0.75,
        xRight: 3.25,
        fillStyle: 'full',
        color: PrimeColor.green,
        opacity: 0.3
      }}
    />
    <TemplateComponent objects={appletObjects} />
  </GridCanvas2D>
  <GridCanvas2D
    {draggables}
    initialViewBox={new ViewBox(new Vector2(-maxRadius, -10), new Vector2(maxRadius, 10), 0.2)}
    labels={{ xLabel: 'u(0)', yLabel: "u'(0)" }}
    axis={axis2}
    scaleX={16}
    scaleY={1}
    gridColumn="2"
    gridRow="1"
  >
    <ImplicitFunction2D
      zeroFunc={zeroFunction}
      maxDepth={2}
      // stepSize={0.1}
      xMin={-maxRadius * 1.1}
      xMax={maxRadius * 1.1}
      yMin={-10}
      yMax={10}
      width={0.08}
      isDashed={true}
    />
  </GridCanvas2D>
  <GridCanvas2D
    initialViewBox={new ViewBox(new Vector2(0, -2.0 / 2), new Vector2(5, 1.0 / 2), 2)}
    labels={{ xLabel: 't', yLabel: 'u(t)' }}
    axis={axis3}
    scaleX={4}
    scaleY={5}
    gridColumn="1 / span 2"
    gridRow="2"
  >
    {@const A = draggables[0].position.x}
    {@const B = draggables[0].position.y}
    {@const c1 = (9 * A + B) / 5}
    {@const c2 = (-4 * A - B) / 5}
    {@const time = controls[0].time}
    <ExplicitFunction2D
      func={(t: number) => c1 * Math.exp(-4 * t) + c2 * Math.exp(-9 * t)}
      color={PrimeColor.blue}
      width={0.1}
      xMin={0}
      xMax={5}
    />
    <Line2D
      start={new Vector2(0, draggables[0].position.x).sub(
        new Vector2(1, draggables[0].position.y).multiplyScalar(0.15)
      )}
      end={new Vector2(0, draggables[0].position.x).add(
        new Vector2(1, draggables[0].position.y).multiplyScalar(0.15)
      )}
      color={PrimeColor.red}
      width={0.1}
    />
    <Point2D
      position={new Vector2(0, draggables[0].position.x)}
      color={PrimeColor.raspberry}
      shape="square"
    />
    <Point2D
      position={new Vector2(time, c1 * Math.exp(-4 * time) + c2 * Math.exp(-9 * time))}
      color={PrimeColor.yellow}
      shape="square"
    />
  </GridCanvas2D>
</CanvasGrid>
