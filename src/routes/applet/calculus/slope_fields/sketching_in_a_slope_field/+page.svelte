<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import VectorField2D from '$lib/d3/VectorField2D.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { toLatexText } from '$lib/utils/FormatString';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';

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
    new Vector2(-3, -4), // bottom-left
    new Vector2(4, 7), // top-right
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
  xAxisLabel = 't';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  function SnapToGrid(position: Vector2): Vector2 {
    const gridSize = 0.1; // Adjust the grid size as needed
    const snappedX = 0; // Snap x-coordinate to 0
    const snappedY = Math.round(position.y / gridSize) * gridSize;
    return new Vector2(snappedX, snappedY);
  }
  const t0 = 0;
  const y0 = 1;
  const draggablePoint = [
    new Draggable(new Vector2(t0, y0), PrimeColor.orange, undefined, SnapToGrid)
  ];

  const state = {
    tMin: 0,
    tMax: 0
  };

  type S = typeof state;

  const transitions = [
    // Step 1: Forward sketching
    (t: number, state: S) => {
      state.tMax = (1 - t ** 4) * 0 + t ** 4 * 30;
      return {
        state,
        labelPrev: toLatexText('$t=0$'),
        labelNext: 't\\geq 0'
      };
    },
    // Step 2: Backward sketching
    (t: number, state: S) => {
      state.tMin = (1 - t) * 0 + t * -30;
      return {
        state,
        labelPrev: 't\\geq 0',
        labelNext: 't\\in\\mathbb{R}'
      };
    }
  ];

  const controls = Controls.addSlideShow(state, transitions, toLatexText('$t=0$'));

  function Solution(t: number, y0: number): number {
    return (1 / 4) * ((4 * y0 + 1) * Math.exp(2 * t) - 2 * t - 1);
  }
</script>

<Canvas2D
  draggables={draggablePoint}
  {controls}
  {initialViewBox}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {@const state = controls[0]}
  <VectorField2D f={(x: number, y: number) => new Vector2(1, x + 2 * y)} color={PrimeColor.blue} />
  <ExplicitFunction2D
    func={(t: number) => Solution(t, draggablePoint[0].position.y)}
    xMin={state.tMin}
    xMax={state.tMax}
    color={PrimeColor.orange}
    width={0.08}
  />
</Canvas2D>
