<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import Pendulum2D from '$lib/d3/Pendulum2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import { AppletObject, LineFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
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
    new Vector2(-5, 0), // bottom-left
    new Vector2(5, 5), // top-right
    0.5 // margin
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
    skipY: -1,
    showAxisX: false,
    showAxisY: false
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
    skipX: 0,
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
      { width: 0.03, isDashed: true }
    )
  );

  const draggables = [
    new Draggable(
      new Vector2(Math.PI / 6, 0),
      PrimeColor.darkGreen,
      undefined,
      SnapToGrid,
      undefined,
      undefined,
      0.2
    )
  ];
  const maxRadius = (0.9 * Math.PI) / 2;
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

  const r = Math.sqrt(9.81 / 5); // g/L

  const state = {
    time: 0
  };

  type S = typeof state;

  const transitions: SlideShowSteps<S> = [
    // Step 1: time increases to 10
    {
      transition: (t: number, state: S) => {
        state.time = 10 * t;
        return {
          state,
          labelPrev: toLatexText('Initial state'),
          labelNext: toLatexText('Final state')
        };
      },
      duration: 10000,
      timeSteps: 1000
    }
  ];

  const controls = Controls.addSlideShow(state, transitions, toLatexText('Initial state'));
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
    <TemplateComponent objects={appletObjects} />

    <Angle2D
      color={PrimeColor.black + PrimeColor.opacity(0.8)}
      startAngle={-Math.PI / 2 - maxRadius}
      endAngle={-Math.PI / 2 + maxRadius}
      origin={new Vector2(0, 5)}
      width={0.02}
      distance={5}
      hasHead={true}
    />
    <Pendulum2D
      stringAngle={((c1 * Math.cos(r * time) + c2 * Math.sin(r * time)) / Math.PI) * 180}
    />
    <Latex2D
      latex="\theta"
      color={PrimeColor.black}
      position={new Vector2(
        5 * Math.cos(-Math.PI / 2 + maxRadius),
        5 + 5 * Math.sin(-Math.PI / 2 + maxRadius)
      )}
      alignX="left"
      alignY="top"
      background={PrimeColor.white}
    />
    <Latex2D
      latex="0"
      color={PrimeColor.black}
      position={new Vector2(0, 0)}
      alignX="center"
      alignY="top"
      background={PrimeColor.white}
    />
  </GridCanvas2D>
  <GridCanvas2D
    {draggables}
    initialViewBox={new ViewBox(
      new Vector2(-Math.PI / 2, (-Math.PI / 2) * r),
      new Vector2(Math.PI / 2, (Math.PI / 2) * r),
      0.1
    )}
    labels={{ xLabel: '\\theta(0)', yLabel: "\\theta'(0)" }}
    axis={axis2}
    scaleX={2}
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
    />
  </GridCanvas2D>
  <GridCanvas2D
    initialViewBox={new ViewBox(
      new Vector2(0, -Math.PI / 2 / 2),
      new Vector2(10, Math.PI / 2 / 2),
      2
    )}
    labels={{ xLabel: 't', yLabel: '\\theta(t)' }}
    axis={axis3}
    scaleX={2}
    scaleY={2}
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
      xMax={10}
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
    <Point2D position={new Vector2(0, draggables[0].position.x)} color={PrimeColor.raspberry} />
    <Point2D
      position={new Vector2(time, c1 * Math.cos(r * time) + c2 * Math.sin(r * time))}
      color={PrimeColor.yellow}
    />
  </GridCanvas2D>
</CanvasGrid>
