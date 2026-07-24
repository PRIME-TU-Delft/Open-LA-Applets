<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import { Controls } from '$lib/controls/Controls';

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
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const Integrand = (x: number) => Math.cos(x) * Math.exp(Math.sin(x));
  const IntegrandU = (u: number) => Math.exp(u);
  const IntegralU = (u: number) => Math.exp(u) + 0.5;
  const Integral = (x: number) => Math.exp(Math.sin(x)) + 0.5;

  const state = {
    fx: 1,
    fu: 0,
    Fu: 0,
    Fx: 0,
    xMin: -30,
    xMax: 30,
    xLabel: 'x' as string
  };

  type S = typeof state;

  const transitions = [
    // Step 1: fx -> fu
    (t: number, state: S) => {
      state.fx = 1 - t;
      state.fu = t;
      state.xMin = (1 - Math.sqrt(t)) * -30 + Math.sqrt(t) * -1;
      state.xMax = (1 - Math.sqrt(t)) * 30 + Math.sqrt(t) * 1;
      state.xLabel = t > 0.5 ? 'u' : 'x';
      return {
        state,
        labelPrev: 'f(x)=\\cos(x)e^{\\sin(x)}',
        labelNext: 'f(u)=e^{\\sin(u)}'
      };
    },
    // Step 2: fu -> Fu
    (t: number, state: S) => {
      state.fu = 1 - t;
      state.Fu = t;
      return {
        state,
        labelPrev: 'f(u)=e^{\\sin(u)}',
        labelNext: '\\int f(u)\\,du = e^{\\sin(u)} + \\frac{1}{2}'
      };
    },
    // Step 3: Fu -> Fx
    (t: number, state: S) => {
      state.Fu = 1 - t;
      state.Fx = t;
      state.xMin = t ** 2 * -30 + (1 - t ** 2) * -1;
      state.xMax = t ** 2 * 30 + (1 - t ** 2) * 1;
      state.xLabel = t > 0.5 ? 'x' : 'u';
      return {
        state,
        labelPrev: '\\int f(u)\\,du = e^{\\sin(u)} + \\frac{1}{2}',
        labelNext: '\\int f(x)\\,dx = e^{\\sin(x)} + \\frac{1}{2}'
      };
    }
  ];

  const controls = Controls.addSlideShow(state, transitions, 'f(x)=\\cos(x)e^{\\sin(x)}');

  function blendColor(s: S): string {
    const cols = [
      [s.fx, PrimeColor.raspberry],
      [s.fu, PrimeColor.yellow],
      [s.Fu, PrimeColor.green],
      [s.Fx, PrimeColor.darkGreen]
    ] as const;
    let r = 0,
      g = 0,
      b = 0;
    for (const [w, hex] of cols) {
      r += w * parseInt(hex.slice(1, 3), 16);
      g += w * parseInt(hex.slice(3, 5), 16);
      b += w * parseInt(hex.slice(5, 7), 16);
    }
    return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
  }
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  labels={{ xLabel: (controls[0] as S).xLabel, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {@const state = controls[0]}
  <ExplicitFunction2D
    func={(x: number) =>
      state.fx * Integrand(x) +
      state.fu * IntegrandU(x) +
      state.Fu * IntegralU(x) +
      state.Fx * Integral(x)}
    color={blendColor(state)}
    width={0.06}
    xMin={state.xMin}
    xMax={state.xMax}
  />
</Canvas2D>
