<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import VectorField2D from '$lib/d3/VectorField2D.svelte';
  import { Controls } from '$lib/controls/Controls';

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
  const state = {
    // Only (0,1)
    xMin: 0,
    xMax: 0,
    yMin: 1,
    yMax: 1
  };

  type S = typeof state;

  const transitions = [
    // Step 1: add (0,2)
    (t: number, state: S) => {
      state.yMax = 1 * (1 - t) + 2 * t;
      return {
        state,
        labelPrev: toLatexText('$(0,1)$'),
        labelNext: '(0,y), y\\in\\{1,2\\}'
      };
    },
    // Step 2: add (0,y)
    (t: number, state: S) => {
      // Avoid non-integer yMin and Ymax in this case
      state.yMin = Math.round(1 * (1 - t) + -30 * t);
      state.yMax = Math.round(2 * (1 - t) + 30 * t);
      return {
        state,
        labelPrev: '(0,y), y\\in\\{1,2\\}',
        labelNext: '(0,y), y\\in\\mathbb{Z}'
      };
    },
    // Step 3: add (1,y)
    (t: number, state: S) => {
      state.xMax = 0 * (1 - t) + 1 * t;
      return {
        state,
        labelPrev: '(0,y), y\\in\\mathbb{Z}',
        labelNext: '(t,y), t\\in\\{0,1\\}, y\\in\\mathbb{Z}'
      };
    },
    // Step 4: add (x,y)
    (t: number, state: S) => {
      // Avoid non-integer yMin and Ymax in this case
      state.xMin = Math.round(0 * (1 - t) + -30 * t);
      state.xMax = Math.round(1 * (1 - t) + 30 * t);
      return {
        state,
        labelPrev: '(t,y), t\\in\\{0,1\\}, y\\in\\mathbb{Z}',
        labelNext: '(t,y), t\\in\\mathbb{Z}, y\\in\\mathbb{Z}'
      };
    }
  ];

  const controls = Controls.addSlideShow(state, transitions, toLatexText('$(0,1)$'));
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {@const state = controls[0]}
  <VectorField2D
    f={(x: number, y: number) => new Vector2(1, x + 2 * y)}
    xRange={[state.xMin, state.xMax]}
    yRange={[state.yMin, state.yMax]}
    color={PrimeColor.blue}
  />
</Canvas2D>
