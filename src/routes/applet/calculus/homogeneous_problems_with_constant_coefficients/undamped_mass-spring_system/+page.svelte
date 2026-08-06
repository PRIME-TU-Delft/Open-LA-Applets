<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import MassSpring2D from '$lib/d3/MassSpring2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { AppletObject, LineFragment } from '$lib/template/TemplateAppletObjects';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import { Controls } from '$lib/controls/Controls';
  import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
  import { toLatexText } from '$lib/utils/FormatString';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';

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
    new Vector2(-1.5, -2.5), // bottom-left
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
    skipX: 0,
    skipY: 0,
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

  let appletObjects: AppletObject[] = [];
  appletObjects.push(
    new LineFragment(
      new Vector2(0, 5),
      new Vector2(0, -1),
      PrimeColor.black + PrimeColor.opacity(0.8),
      { width: 0.05, isDashed: true }
    )
  );

  const draggables = [
    new Draggable(
      new Vector2(0.25, 0),
      PrimeColor.darkGreen,
      undefined,
      SnapToGrid,
      undefined,
      undefined,
      0.2
    )
  ];
  const maxRadius = 2.25 * (1 / 8);
  function SnapToGrid(position: Vector2): Vector2 {
    const snappedX = Number(position.x.toFixed(1));
    const snappedY = Number(position.y.toFixed(1));
    const checkInEllips =
      Math.pow(snappedX, 2) + Math.pow(snappedY / r, 2) <= Math.pow(maxRadius, 2);
    if (!checkInEllips) {
      const angle = Math.atan2(snappedY / r, snappedX);
      const newX = maxRadius * Math.cos(angle);
      const newY = maxRadius * Math.sin(angle) * r;
      return new Vector2(newX, newY);
    }
    return new Vector2(snappedX, snappedY);
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
    {@const c1 = draggables[0].position.x}
    {@const c2 = draggables[0].position.y / r}
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
      massLocation={-1 * (4 / 0.5) * (c1 * Math.cos(r * time) + c2 * Math.sin(r * time))}
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
  </GridCanvas2D>
  <GridCanvas2D
    {draggables}
    initialViewBox={new ViewBox(
      new Vector2(-maxRadius, -maxRadius * r),
      new Vector2(maxRadius, maxRadius * r),
      0.2
    )}
    labels={{ xLabel: 'u(0)', yLabel: "u'(0)" }}
    axis={axis2}
    scaleX={10}
    scaleY={2}
    gridColumn="2"
    gridRow="1"
  >
    <ParameterizedFunction2D
      xFunc={(t: number) => maxRadius * Math.cos(t)}
      yFunc={(t: number) => r * maxRadius * Math.sin(t)}
      tStart={0}
      tEnd={2 * Math.PI}
      isDashed
      width={0.05}
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
    {@const c1 = draggables[0].position.x}
    {@const c2 = draggables[0].position.y / r}
    {@const time = controls[0].time}
    <ExplicitFunction2D
      func={(t: number) => c1 * Math.cos(r * t) + c2 * Math.sin(r * t)}
      color={PrimeColor.blue}
      width={0.1}
      xMin={0}
      xMax={5}
    />
    <Line2D
      start={new Vector2(0, draggables[0].position.x).sub(
        new Vector2(1, draggables[0].position.y).multiplyScalar(0.5)
      )}
      end={new Vector2(0, draggables[0].position.x).add(
        new Vector2(1, draggables[0].position.y).multiplyScalar(0.5)
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
      position={new Vector2(time, c1 * Math.cos(r * time) + c2 * Math.sin(r * time))}
      color={PrimeColor.yellow}
      shape="square"
    />
  </GridCanvas2D>
</CanvasGrid>
