<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Controls } from '$lib/controls/Controls';
  import Angle3D from '$lib/threlte/Angle3D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import NumberFlow from '@number-flow/svelte';

  const slider_step = 0.5;
  let controls = Controls.addSlider(-3, -5, 5, slider_step, PrimeColor.yellow, {
    label: 'x',
    labelFormat
  })
    .addSlider(3, -5, 5, slider_step, PrimeColor.yellow, {
      label: 'y',
      labelFormat
    })
    .addSlider(6, -5, 6, slider_step, PrimeColor.yellow, {
      label: 'z',
      labelFormat
    });

  const A = $derived(new MathVector3(controls[0], controls[1], controls[2]));
  const Q = $derived(new MathVector3(controls[0], controls[1], 0));
  const v_p = $derived(new MathVector3(0, controls[1], 0));

  const formulas = $derived.by(() => {
    const f0 = new Formula('A = ( \\$1 , \\$2 , \\$3 )')
      .addParam(1, round(A.mathX), PrimeColor.yellow)
      .addParam(2, round(A.mathY), PrimeColor.yellow)
      .addParam(3, round(A.mathZ), PrimeColor.yellow);
    const f1 = new Formula('OQ = \\$', round(Q.length()), PrimeColor.raspberry);
    const f2 = new Formula('QA = \\$', round(controls[2]), PrimeColor.yellow);
    const f3 = new Formula(
      `OA = || \\textcolor{${PrimeColor.blue}}{\\mathbf{v}} || = \\sqrt{\\$1^2 + \\$2^2}`
    )
      .addParam(1, round(Q.length()), PrimeColor.raspberry)
      .addParam(2, round(controls[2]), PrimeColor.yellow);
    const f4 = new Formula('OA =  \\$', A.length(), PrimeColor.blue);

    return [f0, f1, f2, f3, f4];
  });
</script>

{#snippet labelFormat(value: number)}
  <NumberFlow {value} />
{/snippet}

<Canvas3D {controls} {formulas} cameraPosition={new MathVector3(10.42, 2.73, 13.56)}>
  <!-- Vector q [raspberry] -->
  <Vector3D direction={Q} color={PrimeColor.raspberry} length={Q.length()} />
  <Latex3D latex="Q" position={Q} color={PrimeColor.raspberry} fontSize={1.1} />

  <!-- Vector a [Yellow] -->
  <Vector3D
    origin={Q}
    direction={new MathVector3(0, 0, A.mathZ)}
    color={PrimeColor.yellow}
    length={Math.abs(A.mathZ)}
  />
  <Latex3D latex="A" position={A} color={PrimeColor.yellow} fontSize={1.3} />

  <!-- Vector v [Blue] -->
  <Vector3D direction={A} color={PrimeColor.blue} length={A.length()} />
  <Latex3D
    latex={'\\mathbf{v}'}
    position={A.clone()
      .multiplyScalar(0.5)
      .add(new MathVector3(0, -0.4, -0.4))}
    color={PrimeColor.blue}
  />

  <!-- Helper green lines -->
  <Vector3D color={PrimeColor.darkGreen} direction={v_p} length={v_p.length()} />

  <Vector3D
    direction={new MathVector3(Q.mathX, 0, 0)}
    origin={v_p}
    color={PrimeColor.darkGreen}
    length={Math.abs(Q.mathX)}
  />

  <!-- Angle green lines -->
  <Angle3D
    forceRightAngle
    vs={[new MathVector3(A.mathX, 0, 0), new MathVector3(0, -A.mathY, 0)]}
    origin={v_p}
    size={0.5}
  />

  <!-- Angle red and Yellow -->
  <Angle3D
    forceRightAngle
    vs={[new MathVector3(0, 0, A.mathZ), Q.clone().multiplyScalar(-1)]}
    size={1}
    origin={Q}
  />

  <!-- a_1 -->
  <Latex3D latex="a_1" position={new MathVector3(A.mathX, 0, 0)} extend={0.5} />
  <Point3D position={new MathVector3(A.mathX, 0, 0)} color={PrimeColor.black} />
  <Vector3D
    direction={v_p}
    origin={new MathVector3(Q.mathX, 0, 0)}
    color="black"
    length={Math.abs(v_p.length())}
    isDashed
  />

  <!--  a_2-->
  <Latex3D latex="a_2" position={v_p} extend={0.5} />
  <Latex3D
    latex="P"
    position={v_p}
    extend={0.5}
    offset={new MathVector3(0, -0.5, -0.75)}
    color={PrimeColor.darkGreen}
  />

  <!-- a_3 -->
  <Latex3D latex="a_3" position={new MathVector3(0, -0.3, A.mathZ)} extend={0.5} />
  <Point3D position={new MathVector3(0, 0, A.mathZ)} color={PrimeColor.black} />
  <Vector3D
    direction={Q}
    origin={new MathVector3(0, 0, A.mathZ)}
    color="black"
    length={Q.length()}
    isDashed
  />

  <Axis3D showNumbers floor axisLength={10} />
</Canvas3D>
