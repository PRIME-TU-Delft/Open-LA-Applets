<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';

  let initialViewBox: ViewBox | undefined;
  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;
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
  cameraPosition = new Vector2(3, 1);
  cameraZoom = 1.5;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-3, -22), // bottom-left
    new Vector2(4, 8), // top-right
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
    skipX: 2,
    skipY: 2
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

  const state = {
    // format: D*C*sin(A*(x-B))+E
    // initial state
    A: 1, // becomes 2
    B: 0, // becomes 1
    C: 1, // becomes -1
    D: 1, // becomes 3
    E: 0, // becomes 4
    label: toLatexText('$y=\\sin(x)$')
  };

  type S = typeof state;

  const transitions = [
    // Step 1: E: 0 -> 4
    (t: number, state: S) => {
      state.E = 0 + t * (4 - 0);
      state.label = toLatexText(
        '$y=\\sin(x)' + (state.E > 0 ? '+' + state.E.toFixed(1).replace('.0', '') : '') + '$'
      );
      return {
        state,
        labelNext: toLatexText('$y=\\sin(x)+4$'),
        labelPrev: toLatexText('$y=\\sin(x)$')
      };
    },
    // Step 2: C: 1 -> -1
    (t: number, state: S) => {
      state.C = 1 + t * (-1 - 1);
      state.label = toLatexText(
        '$y=' +
          (state.C < 0 ? '-' : '') +
          (Math.abs(state.C) < 1 ? Math.abs(state.C).toFixed(1).replace('.0', '') : '') +
          '(\\sin(x)+4)$'
      );
      return {
        state,
        labelNext: toLatexText('$y=-(\\sin(x)+4)$'),
        labelPrev: toLatexText('$y=\\sin(x)+4$')
      };
    },
    // Step 3: D: 1 -> 3
    (t: number, state: S) => {
      state.D = 1 + t * (3 - 1);
      state.label = toLatexText(
        '$y=-' + (state.D > 1 ? state.D.toFixed(1).replace('.0', '') : '') + '(\\sin(x)+4)$'
      );
      return {
        state,
        labelNext: toLatexText('$y=-3(\\sin(x)+4)$'),
        labelPrev: toLatexText('$y=-(\\sin(x)+4)$')
      };
    },
    // Step 4: B: 0 -> 1
    (t: number, state: S) => {
      state.B = 0 + t * (1 - 0);
      state.label = toLatexText(
        '$y=-3(\\sin(x' + (state.B > 0 ? '-' + state.B.toFixed(1).replace('.0', '') : '') + ')+4)$'
      );
      return {
        state,
        labelNext: toLatexText('$y=-3(\\sin(x-1)+4)$'),
        labelPrev: toLatexText('$y=-3(\\sin(x)+4)$')
      };
    },
    // Step 5: A: 1 -> 2
    (t: number, state: S) => {
      state.A = 1 + t * (2 - 1);
      state.label = toLatexText(
        '$y=-3(\\sin(' + (state.A > 1 ? state.A.toFixed(1).replace('.0', '') : '') + 'x-1)+4)$'
      );
      return {
        state,
        labelNext: toLatexText('$y=-3(\\sin(2(x-1))+4)$'),
        labelPrev: toLatexText('$y=-3(\\sin(x-1)+4)$')
      };
    }
  ];

  const controls = Controls.addSlideShow(state, transitions, toLatexText('$y=\\sin(x)$'));

  const legendItems = $derived([new LegendItem(controls[0].label, PrimeColor.blue)]);
</script>

<Canvas2D
  {legendItems}
  {controls}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {@const state = controls[0]}
  <ExplicitFunction2D
    func={(x: number) => state.D * state.C * (Math.sin(state.A * x - state.B) + state.E)}
    color={PrimeColor.blue}
  />
</Canvas2D>
