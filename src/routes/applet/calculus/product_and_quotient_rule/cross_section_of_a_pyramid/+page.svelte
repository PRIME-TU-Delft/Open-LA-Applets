<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import Polygon2D from '$lib/d3/Polygon2D.svelte';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Controls } from '$lib/controls/Controls';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';

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
    new Vector2(-3, -2), // bottom-left
    new Vector2(4, 2), // top-right
    0.5 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: false,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: -1,
    skipY: -1,
    showAxisX: false,
    showAxisY: false
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

  // ##############
  // APPLET OBJECTS
  // ##############
  let A = new MathVector3(-1.8, -1, 0);
  let B = new MathVector3(1.8, -1, 0);
  let C = new MathVector3(1.8, 1, 0);
  let D = new MathVector3(-1.8, 1, 0);
  let E = new MathVector3(0, 0, 3);

  const controls = Controls.addSlider(0.3, 0, 1, 0.01, PrimeColor.pstBlack, {
    label: toLatexText('$\\Delta x$'),
    valueFn: () => ''
  }).addSlider(0.7, 0, 1, 0.01, PrimeColor.orange, {
    label: toLatexText('$x$'),
    valueFn: () => ''
  });

  let x = $derived(1 - controls[1]); // Relative position of horizontal intersection along a side edge
  let AE = $derived(E.clone().sub(A).multiplyScalar(x).add(A)); // Point along edge AE based on x
  let BE = $derived(E.clone().sub(B).multiplyScalar(x).add(B)); // Point along edge BE based on x
  let CE = $derived(E.clone().sub(C).multiplyScalar(x).add(C)); // Point along edge CE based on x
  let DE = $derived(E.clone().sub(D).multiplyScalar(x).add(D)); // Point along edge DE based on x

  let AE2 = $derived(new Vector2(AE.mathX, AE.mathY));
  let BE2 = $derived(new Vector2(BE.mathX, BE.mathY));
  let CE2 = $derived(new Vector2(CE.mathX, CE.mathY));
  let DE2 = $derived(new Vector2(DE.mathX, DE.mathY));

  let y = $derived(1 - controls[1] - controls[0]); // Relative position of horizontal intersection along a side edge
  let AF = $derived(E.clone().sub(A).multiplyScalar(y).add(A)); // Point along edge AE based on y
  let BF = $derived(E.clone().sub(B).multiplyScalar(y).add(B)); // Point along edge BE based on y
  let CF = $derived(E.clone().sub(C).multiplyScalar(y).add(C)); // Point along edge CE based on y
  let DF = $derived(E.clone().sub(D).multiplyScalar(y).add(D)); // Point along edge DE based on y

  let AF2 = $derived(new Vector2(AF.mathX, AF.mathY));
  let BF2 = $derived(new Vector2(BF.mathX, BF.mathY));
  let CF2 = $derived(new Vector2(CF.mathX, CF.mathY));
  let DF2 = $derived(new Vector2(DF.mathX, DF.mathY));

  let shift = $derived(AF2.clone().sub(AE2));
  let AF2shift = $derived(AF2.clone().sub(shift));
  let BF2shift = $derived(BF2.clone().sub(shift));
  let CF2shift = $derived(CF2.clone().sub(shift));
  let DF2shift = $derived(DF2.clone().sub(shift));

  let F2 = $derived(BF2shift.clone().add(CE2.clone().sub(BE2)));
  let G2 = $derived(DF2shift.clone().add(CE2.clone().sub(DE2)));
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  // legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <Polygon2D points={[AE2, BE2, CE2, DE2]} color={PrimeColor.blue} opacity={0.6} strokeWidth={0} />
  <Polygon2D
    points={[AE2, BE2, CE2, DE2]}
    color={PrimeColor.blue}
    fillStyle="none"
    opacity={1}
    strokeWidth={0.5}
  />
  <Polygon2D
    points={[BE2, BF2shift, F2, CE2]}
    color={PrimeColor.green}
    opacity={0.6}
    fillStyle="full"
    strokeWidth={0}
  />
  <Polygon2D
    points={[BE2, BF2shift, F2, CE2]}
    color={PrimeColor.green}
    fillStyle="none"
    strokeWidth={0.5}
  />
  <Polygon2D
    points={[DE2, DF2shift, G2, CE2]}
    color={PrimeColor.pink}
    opacity={0.6}
    fillStyle="full"
    strokeWidth={0}
  />
  <Polygon2D
    points={[DE2, DF2shift, G2, CE2]}
    color={PrimeColor.pink}
    fillStyle="none"
    strokeWidth={0.5}
  />
  <Polygon2D
    points={[CE2, F2, CF2shift, G2]}
    color={PrimeColor.pstBlack}
    opacity={0.6}
    fillStyle="full"
    strokeWidth={0}
  />
  <Polygon2D
    points={[CE2, F2, CF2shift, G2]}
    color={PrimeColor.pstBlack}
    fillStyle="none"
    strokeWidth={0.5}
  />
  <Vector2D
    color={PrimeColor.green}
    origin={AE2.clone().sub(new Vector2(0, 0.2))}
    direction={new Vector2(1, 0)}
    length={Math.sqrt((BE2.x - AE2.x) ** 2 + (BE2.y - AE2.y) ** 2)}
  />
  <Latex2D
    position={AE2.clone().add(BE2).multiplyScalar(0.5).sub(new Vector2(0, 0.3))}
    latex={toLatexText('$w(x)$')}
    color={PrimeColor.green}
    alignX="center"
    alignY="top"
  />
  <Vector2D
    color={PrimeColor.green}
    origin={BE2.clone().sub(new Vector2(0, 0.2))}
    direction={new Vector2(1, 0)}
    length={Math.sqrt((BE2.x - BF2shift.x) ** 2 + (BE2.y - BF2shift.y) ** 2)}
  />
  <Latex2D
    position={BE2.clone().add(BF2shift).multiplyScalar(0.5).sub(new Vector2(0, 0.3))}
    latex={toLatexText('$\\Delta w$')}
    color={PrimeColor.green}
    alignX="center"
    alignY="top"
  />
  <Vector2D
    color={PrimeColor.pink}
    origin={AE2.clone().sub(new Vector2(0.2, 0))}
    direction={new Vector2(0, 1)}
    length={Math.sqrt((DE2.x - AE2.x) ** 2 + (DE2.y - AE2.y) ** 2)}
  />
  <Latex2D
    position={AE2.clone().add(DE2).multiplyScalar(0.5).sub(new Vector2(0.3, 0))}
    latex={toLatexText('$\\ell(x)$')}
    color={PrimeColor.pink}
    alignX="right"
    alignY="center"
  />
  <Vector2D
    color={PrimeColor.pink}
    origin={DE2.clone().sub(new Vector2(0.2, 0))}
    direction={new Vector2(0, 1)}
    length={Math.sqrt((DE2.x - DF2shift.x) ** 2 + (DE2.y - DF2shift.y) ** 2)}
  />
  <Latex2D
    position={DE2.clone().add(DF2shift).multiplyScalar(0.5).sub(new Vector2(0.4, 0))}
    latex={toLatexText('$\\Delta\\ell$')}
    color={PrimeColor.pink}
    alignX="right"
    alignY="center"
  />
</Canvas2D>
