<script lang="ts">
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import Polygon3D from '$lib/threlte/Polygon3D.svelte';
  import Line3D from '$lib/threlte/Line3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Controls } from '$lib/controls/Controls';
  import { toLatexText } from '$lib/utils/FormatString';

  let A = new MathVector3(-1.8, -1, 0);
  let B = new MathVector3(1.8, -1, 0);
  let C = new MathVector3(1.8, 1, 0);
  let D = new MathVector3(-1.8, 1, 0);
  let E = new MathVector3(0, 0, 3);

  const controls = Controls.addSlider(0.3, 0, 1, 0.01, PrimeColor.orange, {
    label: toLatexText('$x$'),
    valueFn: () => ''
  });

  let x = $derived(controls[0]); // Relative position of horizontal intersection along a side edge, from the bottom
  let AE = $derived(E.clone().sub(A).multiplyScalar(x).add(A)); // Point along edge AE based on x
  let BE = $derived(E.clone().sub(B).multiplyScalar(x).add(B)); // Point along edge BE based on x
  let CE = $derived(E.clone().sub(C).multiplyScalar(x).add(C)); // Point along edge CE based on x
  let DE = $derived(E.clone().sub(D).multiplyScalar(x).add(D)); // Point along edge DE based on x

  let xOrigin = $derived(new MathVector3(BE.mathX, BE.mathY, E.mathZ));
  let xEnd = $derived(new MathVector3(BE.mathX, BE.mathY, AE.mathZ));
  let xDiff = $derived(xEnd.clone().sub(xOrigin));
  let xPosition = $derived(xOrigin.clone().add(xDiff.clone().multiplyScalar(0.3)));

  let WidthDiff = $derived(CE.clone().sub(BE));
  let WidthPosition = $derived(BE.clone().add(WidthDiff.clone().multiplyScalar(0.5)));

  let LengthDiff = $derived(DE.clone().sub(CE));
  let LengthPosition = $derived(CE.clone().add(LengthDiff.clone().multiplyScalar(0.5)));
</script>

<Canvas3D cameraZoom={100} cameraPosition={new MathVector3(25, 10, 4)} {controls}>
  <Line3D origin={A} endPoint={B} color={PrimeColor.pstBlack} radius={0.8} />
  <Line3D origin={A} endPoint={B} color={PrimeColor.pstBlack} radius={0.8} />
  <Line3D origin={B} endPoint={C} color={PrimeColor.pstBlack} radius={0.8} />
  <Line3D origin={C} endPoint={D} color={PrimeColor.pstBlack} radius={0.8} />
  <Line3D origin={D} endPoint={A} color={PrimeColor.pstBlack} radius={0.8} />
  <Line3D origin={E} endPoint={A} color={PrimeColor.pstBlack} radius={0.8} />
  <Line3D origin={E} endPoint={B} color={PrimeColor.pstBlack} radius={0.8} />
  <Line3D origin={E} endPoint={C} color={PrimeColor.pstBlack} radius={0.8} />
  <Line3D origin={E} endPoint={D} color={PrimeColor.pstBlack} radius={0.8} />
  <Polygon3D points={[A, B, C, D]} color={PrimeColor.pstBlack} opacity={0.2} />
  <Line3D origin={AE} endPoint={BE} color={PrimeColor.blue} radius={0.8} />
  <Line3D origin={BE} endPoint={CE} color={PrimeColor.blue} radius={0.8} />
  <Line3D origin={CE} endPoint={DE} color={PrimeColor.blue} radius={0.8} />
  <Line3D origin={DE} endPoint={AE} color={PrimeColor.blue} radius={0.8} />
  <Polygon3D points={[AE, BE, CE, DE]} color={PrimeColor.blue} opacity={0.8} />
  <Vector3D color={PrimeColor.orange} origin={xOrigin} direction={xDiff} />
  <Latex3D
    latex={toLatexText('$x$')}
    position={xPosition}
    offset={new MathVector3(0.2, -0.2, 0)}
    color={PrimeColor.orange}
  />
  <Vector3D color={PrimeColor.green} origin={BE} direction={WidthDiff} alwaysOnTop={true} />
  <Vector3D color={PrimeColor.yellow} origin={CE} direction={LengthDiff} alwaysOnTop={true} />
  <Latex3D
    latex={toLatexText('$w(x)$')}
    position={WidthPosition}
    offset={new MathVector3(0.2, -0.2, -0.2)}
    color={PrimeColor.green}
  />
  <Latex3D
    latex={toLatexText('$l(x)$')}
    position={LengthPosition}
    offset={new MathVector3(0.2, 0.2, -0.2)}
    color={PrimeColor.yellow}
  />
</Canvas3D>
