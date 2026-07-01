<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, ImplicitFunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { LegendItem } from '$lib/utils/Legend';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';

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
    new Vector2(-4, -4), // bottom-left
    new Vector2(4, 4), // top-right
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

  function snapToFunction(position: Vector2) {
    let x = position.x;
    let y = 0;
    return new Vector2(x, y);
  }
  const draggables = [
    new Draggable(new Vector2(1, 0), PrimeColor.orange, undefined, snapToFunction)
  ];
  let xD = $derived(draggables[0].position.x);

  const controls = Controls.addSlider(2, 2, 9, 1, PrimeColor.darkGreen, {
    label: toLatexText('$p$'),
    valueFn: (v: number) => v.toFixed(0),
    animationStep: 1
  })
    .addSlider(5, 2, 9, 1, PrimeColor.orange, {
      label: toLatexText('$q$'),
      valueFn: (v: number) => v.toFixed(0),
      animationStep: 1
    })
    .addSlider(2, -3, 3, 1, PrimeColor.raspberry, {
      label: toLatexText('$b$'),
      valueFn: (v: number) => (Math.sign(v) * v ** 2).toFixed(0),
      animationStep: 1
    });

  function curve(x: number, y: number) {
    let p = controls[0];
    let q = controls[1];
    let b = controls[2];
    return Math.pow(x, p) + Math.pow(y, q) - Math.sign(b) * b ** 2;
  }

  function roots(x: number) {
    const p = controls[0];
    const q = controls[1];
    const b = controls[2];
    const rhs = Math.sign(b) * b ** 2 - Math.pow(x, p);
    if (q % 2 === 0 && rhs < 0) return [-100, -100]; // no real roots for even q if rhs is negative
    if (q % 2 === 0) return [Math.pow(rhs, 1 / q), -Math.pow(rhs, 1 / q)]; // two real roots for even q
    if (q % 2 === 1 && rhs >= 0) return [Math.pow(rhs, 1 / q), Math.pow(rhs, 1 / q)]; // one real root for odd q
    if (q % 2 === 1 && rhs < 0) return [-Math.pow(-rhs, 1 / q), -Math.pow(-rhs, 1 / q)]; // one real root for odd q
    return [-100, -100];
  }
  const yDs = $derived(roots(xD));

  const legendItems = $derived.by(() => {
    let p = controls[0];
    let q = controls[1];
    let b = controls[2];

    return [
      new LegendItem('x^{\\$1} + y^{\\$2} = \\$3', PrimeColor.blue)
        .addAutoParam(p, PrimeColor.darkGreen)
        .addAutoParam(q, PrimeColor.orange)
        .addAutoParam(Math.sign(b) * b ** 2, PrimeColor.raspberry)
    ];
  });

  const appletObjects: AppletObject[] = [
    new ImplicitFunctionFragment(curve, PrimeColor.blue, { maxDepth: 3 })
  ];
</script>

<Canvas2D
  {draggables}
  {controls}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  {legendItems}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
  <InfiniteLine2D
    origin={new Vector2(xD, 0)}
    direction={new Vector2(0, 1)}
    color={PrimeColor.darkGreen}
  />
  <Point2D color={PrimeColor.yellow} position={new Vector2(xD, yDs[0])} shape="square" />
  <Point2D color={PrimeColor.yellow} position={new Vector2(xD, yDs[1])} shape="square" />
</Canvas2D>
