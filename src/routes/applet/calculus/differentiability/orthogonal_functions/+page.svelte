<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, ParameterizedFunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { Controls } from '$lib/controls/Controls';
  import Polygon2D from '$lib/d3/Polygon2D.svelte';

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
    new Vector2(-1, -1), // bottom-left
    new Vector2(16, 10), // top-right
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
  // Points on the outside, never draggable
  const AF = new Vector2(0, 0);
  const AG = new Vector2(0, 10);
  const CF = new Vector2(10, 7);
  const CG = new Vector2(10, 4);
  // Draggable point where functions F and G intersect
  const draggables = [
    new Draggable(
      new Vector2(5, 5),
      PrimeColor.grey,
      undefined,
      Restrict,
      undefined,
      undefined,
      0.15
    )
  ];
  function Restrict(pos: Vector2): Vector2 {
    let x = pos.x;
    x = Math.max(x, 0.1);
    x = Math.min(x, 9.9);
    return new Vector2(x, pos.y);
  }
  const BF = $derived(draggables[0].position);
  const BG = $derived(BF);
  const vF = Math.sqrt((CF.x - AF.x) ** 2 + (CF.y - AF.y) ** 2);
  const vG = Math.sqrt((CG.x - AG.x) ** 2 + (CG.y - AG.y) ** 2);
  // Controls for the slopes of F and G
  // defined as the angle with the horizontal axis
  // slider runs from -0.5 to 0.5 in steps of 0.1
  const controls = Controls.addSlider(0.1, -0.4, 0.4, 0.05, PrimeColor.pink, {
    label: toLatexText('$f^{\\prime}(a)$'),
    valueFn: (_v: number) => '',
    animationStep: 0.01
  }).addSlider(-0.2, -0.4, 0.4, 0.05, PrimeColor.yellow, {
    label: toLatexText('$g^{\\prime}(a)=$'),
    valueFn: (_v: number) => '',
    animationStep: 0.01
  });
  const alphaF = $derived(controls[0] * Math.PI);
  const alphaG = $derived(controls[1] * Math.PI);

  // Create the parametrisations
  function ParamXF(t: number): number {
    let ans = t;
    return ans;
  }
  function ParamYF(x: number): number {
    let t = x - BF.x;
    let m = Math.tan(alphaF);
    let u = AF.x - BF.x;
    let v = CF.x - BF.x;
    let YA = AF.y - BF.y - m * u;
    let YC = CF.y - BF.y - m * v;
    let q = (YC * u ** 2 - YA * v ** 2) / (u ** 2 * v ** 2 * (v - u));
    let p = YA / u ** 2 - q * u;
    let ans = BF.y;
    ans += m * t;
    ans += p * t ** 2;
    ans += q * t ** 3;
    return ans;
  }
  function ParamXG(t: number): number {
    let ans = t;
    return ans;
  }
  function ParamYG(x: number): number {
    let t = x - BG.x;
    let m = Math.tan(alphaG);
    let u = AG.x - BG.x;
    let v = CG.x - BG.x;
    let YA = AG.y - BG.y - m * u;
    let YC = CG.y - BG.y - m * v;
    let q = (YC * u ** 2 - YA * v ** 2) / (u ** 2 * v ** 2 * (v - u));
    let p = YA / u ** 2 - q * u;
    let ans = BG.y;
    ans += m * t;
    ans += p * t ** 2;
    ans += q * t ** 3;
    return ans;
  }
  // Create the optional polygon points and controls
  const size = 0.5;
  const stepF = $derived(new Vector2(Math.cos(alphaF), Math.sin(alphaF)).multiplyScalar(size));
  const stepG = $derived(new Vector2(Math.cos(alphaG), Math.sin(alphaG)).multiplyScalar(size));
  const stepFG = $derived(stepG.clone().add(stepF));
  const P0 = $derived(BF.clone());
  const P1 = $derived(P0.clone().add(stepF));
  const P2 = $derived(P0.clone().add(stepFG));
  const P3 = $derived(P0.clone().add(stepG));
  const showPolygon = $derived.by(() => {
    // get the current dot product
    const dot = Math.cos(alphaF) * Math.cos(alphaG) + Math.sin(alphaF) * Math.sin(alphaG);
    // check if it is one to some accuracy
    if (Math.abs(dot) < 1e-6) {
      return true;
    } else {
      return false;
    }
  });

  const appletObjects: AppletObject[] = $derived([
    new ParameterizedFunctionFragment(ParamXF, ParamYF, PrimeColor.blue, {
      width: 0.08,
      stepSize: 0.01,
      legendText: 'y=f(x)',
      tStart: 0,
      tEnd: 10
    }).addIncludedPoints([AF, CF], undefined, 0.15),
    new ParameterizedFunctionFragment(ParamXG, ParamYG, PrimeColor.darkGreen, {
      width: 0.08,
      stepSize: 0.01,
      legendText: 'y=g(x)',
      tStart: 0,
      tEnd: 10
    }).addIncludedPoints([AG, CG], undefined, 0.15),
    new ParameterizedFunctionFragment(
      (t) => BF.x + t * Math.cos(alphaF),
      (t) => BF.y + t * Math.sin(alphaF),
      PrimeColor.pink,
      { width: 0.12, legendText: toLatexText('Tangent line $f$') }
    ),
    new ParameterizedFunctionFragment(
      (t) => BG.x + t * Math.cos(alphaG),
      (t) => BG.y + t * Math.sin(alphaG),
      PrimeColor.yellow,
      { width: 0.12, legendText: toLatexText('Tangent line $g$') }
    )
  ]);
</script>

<Canvas2D
  {controls}
  {draggables}
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {#if showPolygon}
    <Polygon2D
      points={[P0, P1, P2, P3]}
      color={PrimeColor.black}
      fillStyle="none"
      strokeWidth={2}
    />
  {/if}
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
